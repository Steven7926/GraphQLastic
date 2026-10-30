package elastic

import (
	"log"
	"os"

	"github.com/elastic/go-elasticsearch/v8"
)

var es *elasticsearch.Client

func InitES() {

	// Change to http://localhost:9200 if not using docker to run server
	esURL := os.Getenv("ELASTICSEARCH_URL")
	if esURL == "" {
		esURL = "http://elasticsearch:9200"
	}
	var err error
	es, err = elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{
			esURL,
		},
	})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}
}

func GetES() *elasticsearch.Client {
	return es
}
