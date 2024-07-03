package model

type ElasticsearchResponse struct {
	Took     int    `json:"took"`
	TimedOut bool   `json:"timed_out"`
	Shards   Shards `json:"_shards"`
	Hits     Hits   `json:"hits"`
}

type Shards struct {
	Total      int `json:"total"`
	Successful int `json:"successful"`
	Skipped    int `json:"skipped"`
	Failed     int `json:"failed"`
}

type Hits struct {
	Total    Total   `json:"total"`
	MaxScore float64 `json:"max_score"`
	Hits     []Hit   `json:"hits"`
}

type Total struct {
	Value    int    `json:"value"`
	Relation string `json:"relation"`
}

type Hit struct {
	Index  string    `json:"_index"`
	Type   string    `json:"_type"`
	ID     string    `json:"_id"`
	Score  float64   `json:"_score"`
	Source SamEntity `json:"_source"`
}

type Count struct {
	Count  int    `json:"count"`
	Shards Shards `json:"_shards"`
}
