from elasticsearch import Elasticsearch, NotFoundError, helpers
import argparse
import psycopg
import random
import string
import os
import time
import uuid

ELASTIC_URL = os.environ.get("ELASTIC_URL", "http://localhost:9200")
POSTGRES_URL = os.environ.get("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5433/graphqlastic")

BATCH_SIZE = 100000

CITIES_BY_STATE = {
    "VA": ["Arlington", "Richmond", "Norfolk"],
    "MD": ["Baltimore", "Bethesda", "Columbia"],
    "DC": ["Washington"],
    "CA": ["San Diego", "Los Angeles", "Sacramento"],
    "TX": ["Austin", "San Antonio", "Houston"],
    "FL": ["Tampa", "Orlando", "Jacksonville"],
    "CO": ["Denver", "Colorado Springs", "Aurora"],
    "WA": ["Seattle", "Tacoma", "Spokane"],
    "NY": ["New York", "Buffalo", "Albany"],
    "GA": ["Atlanta", "Savannah", "Augusta"],
}
STATES = list(CITIES_BY_STATE.keys())

STATUSES = ["Active", "Expired", "Inactive", "Pending"]
STATUS_WEIGHTS = [70, 15, 10, 5]

UEI_CHARS = [c for c in string.ascii_uppercase + string.digits if c not in "OI"]

# Populates the "sam_entities" elastic index with 50,000 random documents
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--only-if-missing",
        action="store_true",
        help="do nothing if both stores already hold the expected number of records, so it's safe to run repeatedly",
    )
    args = parser.parse_args()

    number_of_records = int(os.environ.get("POPULATE_RECORDS", 5000000))

    elastic_client = Elasticsearch(ELASTIC_URL, request_timeout=120)
    if elastic_client.ping():
        print("Connected to Elasticsearch")

    with psycopg.connect(POSTGRES_URL) as conn:
        print("Connected to Postgres")

        if args.only_if_missing:
            elastic_count, postgres_count = count_existing(elastic_client, conn)
            print(f"Existing records: Elastic {elastic_count:,}, Postgres {postgres_count:,}, expected {number_of_records:,}")
            if elastic_count == number_of_records and postgres_count == number_of_records:
                print("Both stores are already populated, nothing to do")
                return
            print("Populating...")

        prepare_elastic(elastic_client)
        index_defs = prepare_postgres(conn)

        start = time.time()
        for batch_start in range(0, number_of_records, BATCH_SIZE):
            batch = [build_sam_entity(i) for i in range(batch_start, min(batch_start + BATCH_SIZE, number_of_records))]
            insert_elastic(elastic_client, batch)
            insert_postgres(conn, batch)
            done = batch_start + len(batch)
            print(f"Inserted {done:,} / {number_of_records:,} ({time.time() - start:.0f}s)")

        finish_elastic(elastic_client)
        finish_postgres(conn, index_defs)
        print(f"Done in {time.time() - start:.0f}s")

def count_existing(elastic_client, conn):
    try:
        elastic_count = elastic_client.count(index="sam_entities")["count"]
    except NotFoundError:
        elastic_count = 0
    postgres_count = conn.execute("SELECT count(*) FROM sam_entities").fetchone()[0]
    conn.commit()
    return elastic_count, postgres_count

def build_sam_entity(num):
    name = "Test" + ''.join(random.choice(string.ascii_lowercase) for i in range(16))
    state = random.choice(STATES)
    return {
        "id": str(uuid.uuid4()),
        "name": name,
        "cage_code": build_cage_code(),
        "type": random.choice(["Person", "Company"]),
        "uei": ''.join(random.choice(UEI_CHARS) for i in range(12)),
        "city": random.choice(CITIES_BY_STATE[state]),
        "state": state,
        "status": random.choices(STATUSES, weights=STATUS_WEIGHTS)[0],
        "num": num
    }

def prepare_elastic(elastic_client):
    if elastic_client.indices.exists(index="sam_entities"):
        response = elastic_client.indices.delete(index="sam_entities")
        print("Deleting previous sam_entities index... ", response)
    response = elastic_client.indices.create(
        index="sam_entities",
        settings={"refresh_interval": "-1", "number_of_replicas": 0}
    )
    print("Creating sam_entities index...", response)

def insert_elastic(elastic_client, batch):
    helpers.bulk(
        elastic_client,
        ({"_index": "sam_entities", "_id": e["id"], "_source": e} for e in batch),
        chunk_size=5000
    )

def finish_elastic(elastic_client):
    elastic_client.indices.put_settings(index="sam_entities", settings={"refresh_interval": "1s"})
    elastic_client.indices.refresh(index="sam_entities")
    print("Elastic documents:", elastic_client.count(index="sam_entities")["count"])

def prepare_postgres(conn):
    print("Deleting previous rows...")
    conn.execute("TRUNCATE sam_entities")
    index_defs = conn.execute(
        "SELECT indexname, indexdef FROM pg_indexes "
        "WHERE tablename = 'sam_entities' AND indexname <> 'sam_entities_pkey'"
    ).fetchall()
    for index_name, _ in index_defs:
        conn.execute(f'DROP INDEX "{index_name}"')
    conn.commit()
    return index_defs

def insert_postgres(conn, batch):
    with conn.cursor() as cur:
        with cur.copy("COPY sam_entities (id, name, cage_code, num, type, uei, city, state, status) FROM STDIN") as copy:
            for e in batch:
                copy.write_row((e["id"], e["name"], e["cage_code"], e["num"], e["type"], e["uei"], e["city"], e["state"], e["status"]))
    conn.commit()

def finish_postgres(conn, index_defs):
    for index_name, index_def in index_defs:
        print("Rebuilding index", index_name, "...")
        conn.execute(index_def)
    conn.execute("ANALYZE sam_entities")
    conn.commit()
    print("Postgres rows:", conn.execute("SELECT count(*) FROM sam_entities").fetchone()[0])

def build_cage_code() -> string:
    cage_code = ""
    for i in range(6):
        rand = random.randint(1, 9)
        cage_code = cage_code + str(rand)
    return cage_code

if __name__ == "__main__":
    main()
