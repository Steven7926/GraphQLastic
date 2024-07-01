package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.49

import (
	"context"
	"crypto/rand"
	"fmt"
	"math/big"
	"server/graph/model"
)

// CreateSamEntity is the resolver for the createSamEntity field.
func (r *mutationResolver) CreateSamEntity(ctx context.Context, input model.NewEntity) (*model.SamEntity, error) {
	randNumber, _ := rand.Int(rand.Reader, big.NewInt(100))
	entity := &model.SamEntity{
		ID:       fmt.Sprintf("T%d", randNumber),
		Name:     input.Name,
		CageCode: input.CageCode,
	}
	r.entities = append(r.entities, entity)
	return entity, nil
}

// SamEntities is the resolver for the SamEntities field.
func (r *queryResolver) SamEntities(ctx context.Context) ([]*model.SamEntity, error) {
	return r.entities, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
