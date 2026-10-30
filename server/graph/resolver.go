package graph

import (
	"server/graph/model"
	"strings"
)

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{}

var wildcardEscaper = strings.NewReplacer(`\`, `\\`, `*`, `\*`, `?`, `\?`)

var entityTypeValues = map[model.EntityType]string{
	model.EntityTypePerson:  "Person",
	model.EntityTypeCompany: "Company",
}

var registrationStatusValues = map[model.RegistrationStatus]string{
	model.RegistrationStatusActive:   "Active",
	model.RegistrationStatusInactive: "Inactive",
	model.RegistrationStatusExpired:  "Expired",
	model.RegistrationStatusPending:  "Pending",
}

var searchableFields = []string{"id", "name", "cage_code", "type", "uei", "city", "state", "status"}

type fieldFilter struct {
	field string
	value string
}

func filtersFromArgs(typeArg *model.EntityType, state *model.UsState, status *model.RegistrationStatus) []fieldFilter {
	filters := []fieldFilter{}
	if typeArg != nil {
		filters = append(filters, fieldFilter{"type", entityTypeValues[*typeArg]})
	}
	if state != nil {
		filters = append(filters, fieldFilter{"state", state.String()})
	}
	if status != nil {
		filters = append(filters, fieldFilter{"status", registrationStatusValues[*status]})
	}
	return filters
}
