package graph

import (
	"context"
	"fmt"
	"server/graph/model"
	"server/postgres"
	"strings"
	"unicode"
)

func samEntitiesPostgres(ctx context.Context, limit int, offset *int, before *string, after *string, search *string, filters []fieldFilter) (*model.SamEntityConnection, error) {
	pg := postgres.GetPG()

	var totalCount int
	if err := pg.QueryRow(ctx, "SELECT count(*) FROM sam_entities").Scan(&totalCount); err != nil {
		return nil, err
	}

	where := []string{}
	args := []interface{}{}
	if search != nil {
		if tsQuery := buildPrefixTsQuery(*search); tsQuery != "" {
			args = append(args, tsQuery)
			where = append(where, fmt.Sprintf("search_vector @@ to_tsquery('simple', $%d)", len(args)))
		}
	}
	for _, f := range filters {
		args = append(args, f.value)
		where = append(where, fmt.Sprintf("%s = $%d", f.field, len(args)))
	}

	var totalSearch int
	countSQL := "SELECT count(*) FROM sam_entities" + whereClause(where)
	if err := pg.QueryRow(ctx, countSQL, args...).Scan(&totalSearch); err != nil {
		return nil, err
	}

	order := "ASC"
	if before != nil {
		args = append(args, *before)
		where = append(where, fmt.Sprintf("name < $%d", len(args)))
		order = "DESC"
	} else if after != nil {
		args = append(args, *after)
		where = append(where, fmt.Sprintf("name > $%d", len(args)))
	}

	pageOffset := 0
	if offset != nil {
		pageOffset = *offset
	}
	args = append(args, limit+1, pageOffset)
	pageSQL := fmt.Sprintf(
		"SELECT id::text, name, cage_code, type, uei, city, state, status FROM sam_entities%s ORDER BY name %s LIMIT $%d OFFSET $%d",
		whereClause(where), order, len(args)-1, len(args),
	)

	rows, err := pg.Query(ctx, pageSQL, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	entities := []*model.SamEntity{}
	for rows.Next() {
		entity := &model.SamEntity{}
		if err := rows.Scan(&entity.ID, &entity.Name, &entity.CageCode, &entity.Type, &entity.Uei, &entity.City, &entity.State, &entity.Status); err != nil {
			return nil, err
		}
		entities = append(entities, entity)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	nextPage := false
	if len(entities) > limit {
		entities = entities[:limit]
		nextPage = true
	}
	if before != nil {
		for i, j := 0, len(entities)-1; i < j; i, j = i+1, j-1 {
			entities[i], entities[j] = entities[j], entities[i]
		}
	}

	edges := []*model.SamEntityEdge{}
	for _, entity := range entities {
		edges = append(edges, &model.SamEntityEdge{Node: entity, Cursor: entity.Name})
	}

	var startC, endC *string
	if len(edges) > 0 {
		startC = &edges[0].Cursor
		endC = &edges[len(edges)-1].Cursor
	}

	return &model.SamEntityConnection{
		Nodes:       entities,
		Edges:       edges,
		TotalCount:  totalCount,
		TotalSearch: totalSearch,
		PageInfo: &model.PageInfo{
			StartCursor:     startC,
			EndCursor:       endC,
			HasNextPage:     nextPage,
			HasPreviousPage: pageOffset > 0,
		},
	}, nil
}

func buildPrefixTsQuery(search string) string {
	search = strings.ReplaceAll(search, "-", "")
	words := strings.FieldsFunc(strings.ToLower(search), func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsDigit(r)
	})
	for i, word := range words {
		words[i] = word + ":*"
	}
	return strings.Join(words, " & ")
}

func whereClause(conditions []string) string {
	if len(conditions) == 0 {
		return ""
	}
	return " WHERE " + strings.Join(conditions, " AND ")
}
