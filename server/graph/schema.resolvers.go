package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.49

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"server/elastic"
	"server/graph/model"
	"strings"

	"github.com/elastic/go-elasticsearch/v8/esapi"
)

// CreateSamEntity is the resolver for the createSamEntity field.
func (r *mutationResolver) CreateSamEntity(ctx context.Context, input model.NewEntity) (*model.SamEntity, error) {
	randNumber, _ := rand.Int(rand.Reader, big.NewInt(100))
	entity := &model.SamEntity{
		ID:       fmt.Sprintf("D%d", randNumber),
		Name:     input.Name,
		CageCode: input.CageCode,
	}

	entityJSON, err := json.Marshal(entity)
	if err != nil {
		return nil, err
	}

	es := elastic.GetES()

	req := esapi.IndexRequest{
		Index:      "sam_entities",
		DocumentID: entity.ID,
		Body:       strings.NewReader(string(entityJSON)),
		Refresh:    "true",
	}

	res, err := req.Do(ctx, es)
	if err != nil {
		log.Printf("Error getting response: %s", err)
		return nil, err
	}
	defer res.Body.Close()

	log.Printf("response: %s", res)
	log.Printf("Created entity with ID: %s", entity.ID)

	return entity, nil
}

// SamEntities is the resolver for the SamEntities field.
func (r *queryResolver) SamEntities(ctx context.Context) ([]*model.SamEntity, error) {

	var query strings.Builder
	query.WriteString(`{
		"query": {
			"match_all": {}
		}
	}`)

	req := esapi.SearchRequest{
		Index: []string{"sam_entities"},
		Body:  strings.NewReader(query.String()),
	}
	var err error
	es := elastic.GetES()

	res, err := req.Do(ctx, es)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var esResponse model.ElasticsearchResponse
	if err := json.NewDecoder(res.Body).Decode(&esResponse); err != nil {
		log.Printf("Error parsing the response body: %s", err)
		return nil, err
	}

	entities := []*model.SamEntity{}

	for _, hit := range esResponse.Hits.Hits {
		entities = append(entities, &hit.Source)
	}
	log.Printf("Entities  %v", entities)

	return entities, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
