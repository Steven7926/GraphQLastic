package model

type SamEntity struct {
	ID       string  `json:"uuid"`
	Name     string  `json:"name"`
	CageCode *string `json:"cage_code"`
}
