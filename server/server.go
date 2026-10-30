package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"server/elastic"
	"server/graph"
	"server/postgres"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

const defaultPort = "5051"

func main() {

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))
	// Log every incoming operation with the variables the client sent
	srv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		oc := graphql.GetOperationContext(ctx)
		variables, _ := json.Marshal(oc.Variables)
		log.Printf("[graphql] operation=%s variables=%s", oc.OperationName, variables)
		return next(ctx)
	})
	router.Handle("/query", srv)
	router.Handle("/", playgroundHandler())

	elastic.InitES()
	postgres.InitPG()

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
