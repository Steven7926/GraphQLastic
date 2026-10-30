CREATE EXTENSION IF NOT EXISTS btree_gin;

CREATE TABLE IF NOT EXISTS sam_entities (
    id          UUID PRIMARY KEY,
    name        TEXT NOT NULL,
    cage_code   TEXT,
    num         INTEGER,
    type        TEXT CHECK (type IN ('Person', 'Company')),
    uei         TEXT,
    city        TEXT,
    state       TEXT,
    status      TEXT CHECK (status IN ('Active', 'Inactive', 'Expired', 'Pending')),
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('simple',
            coalesce(name, '') || ' ' ||
            coalesce(cage_code, '') || ' ' ||
            coalesce(num::text, '') || ' ' ||
            coalesce(type, '') || ' ' ||
            coalesce(uei, '') || ' ' ||
            coalesce(city, '') || ' ' ||
            coalesce(state, '') || ' ' ||
            coalesce(status, '')
        ) || array_to_tsvector(ARRAY[replace(id::text, '-', '')])
    ) STORED
);

CREATE INDEX IF NOT EXISTS sam_entities_search_filters_idx ON sam_entities USING GIN (search_vector, type, state, status);
CREATE INDEX IF NOT EXISTS sam_entities_name_idx ON sam_entities (name);
CREATE INDEX IF NOT EXISTS sam_entities_type_name_idx ON sam_entities (type, name);
