package model

type SamEntity struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	CageCode *string `json:"cage_code"`
}
