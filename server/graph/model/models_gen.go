// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Mutation struct {
}

type NewEntity struct {
	Name     string  `json:"name"`
	CageCode *string `json:"cageCode,omitempty"`
}

type PageInfo struct {
	HasNextPage     bool    `json:"hasNextPage"`
	HasPreviousPage bool    `json:"hasPreviousPage"`
	StartCursor     *string `json:"startCursor,omitempty"`
	EndCursor       *string `json:"endCursor,omitempty"`
}

type Query struct {
}

type SamEntityConnection struct {
	Nodes       []*SamEntity     `json:"nodes"`
	Edges       []*SamEntityEdge `json:"edges"`
	PageInfo    *PageInfo        `json:"pageInfo"`
	TotalCount  int              `json:"totalCount"`
	TotalSearch int              `json:"totalSearch"`
}

type SamEntityEdge struct {
	Cursor string     `json:"cursor"`
	Node   *SamEntity `json:"node"`
}
