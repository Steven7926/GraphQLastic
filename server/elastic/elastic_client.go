package elastic

import (
	"log"

	"github.com/elastic/go-elasticsearch/v8"
)

var es *elasticsearch.Client

func InitES() {

	esURL := "http://localhost:9200"
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
