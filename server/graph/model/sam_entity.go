package model

type SamEntity struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	CageCode *string `json:"cage_code"`
	Type     *string `json:"type"`
	Uei      *string `json:"uei"`
	City     *string `json:"city"`
	State    *string `json:"state"`
	Status   *string `json:"status"`
}
