# GraphQLastic
A simple React interface capable of paginating through large datasets quickly using GraphQL as an API for Elastic Querying
- The application is built using:
    - A vite/react/ts frontend 
    - A Golang Chi server on the backend serving up the GraphQL API which connects to Elasticsearch 
    - Elasticsearch for document storing and fetching
- When running you can go to http://localhost:5050 to test out the graphql api in the GraphQL playground

# How to start
1. Run ```docker compose up``` from the root directory to start the web/server/elasticsearch container stack
2. Run ```python3 populate_index.py``` to populate the "sam_entities" index in ElasticSearch
    - You may need to install requirements first
        - ```pip3 install -r requirements.txt```
    - It may run for a minute as its inserting 50,000 documents.
    - You might have to create a virtual env, to do so
        - ```python3 -m venv [name the env]```
        - ``` cd [name of the env]/bin```
        - ``` source activate```
3. Thats It! Now go to the frontend on http://localhost:5173 and start searching to see performance 
