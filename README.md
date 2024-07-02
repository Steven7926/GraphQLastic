# GraphQLastic
A simple React interface capable of paginating through large datasets quickly using GraphQL as an API for Elastic Querying

# How to start
1. Run "docker compose up" from the root directory to start the web/server/elasticsearch container stack
2. Run "python3 populate_index.py" to populate the "sam_entities" index in ElasticSearch
3. Thats It!, now go to the frontend on localhost:8080 and start searching to see performance. 
