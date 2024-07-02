package main

import (
	"log"
	"net/http"
	"os"
	"server/elastic"
	"server/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

const defaultPort = "5050"

func main() {

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))

	router.Handle("/query", graphqlHandler())
	router.Handle("/", playgroundHandler())

	elastic.InitES()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	http.ListenAndServe(":"+port, router)
}

func graphqlHandler() http.Handler {
	return handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))
}

func playgroundHandler() http.Handler {
	return playground.Handler("GraphQL playground", "/query")
}
