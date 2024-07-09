from elasticsearch import Elasticsearch
import random
import string
import uuid

# Populates the "sam_entities" elastic index with 50,000 random documents
def main():
    number_of_records = 50000
    elastic_client  = Elasticsearch(
        "http://localhost:9200"
    )

    if elastic_client.ping():
        print("Connected to Elasticsearch")

    if "sam_entities" not in elastic_client.indices.get_alias().keys():
        response = elastic_client.indices.create(index="sam_entities")
        print("sam_entities index does not exist, creating...", response)
    else:
        response = elastic_client.delete_by_query(
            index="sam_entities",
            body={
                "query": {
                    "match_all": {}
                }
            }
        )
        print("Deleting previous documents... ", response)

    for i in range(number_of_records):
        name = "Test" + ''.join(random.choice(string.ascii_lowercase) for i in range(16))
        cage_code = build_cage_code()
        id = uuid.uuid4()
        sam_entity = {
            "id": id,
            "name": name,
            "cage_code": cage_code,
            "num": i
        }
        print("Inserting into Elastic index: ", sam_entity)
        elastic_client.index(
            index='sam_entities',
            document=sam_entity
        )

def build_cage_code() -> string:
    cage_code = ""
    for i in range(6):
        rand = random.randint(1, 9)
        cage_code = cage_code + str(rand)
    return cage_code

if __name__ == "__main__":
    main()