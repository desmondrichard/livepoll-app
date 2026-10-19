package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Option struct {
	ID    int    `json:"id" bson:"id"`
	Text  string `json:"text" bson:"text"`
	Votes int    `json:"votes" bson:"votes"`
}

type Poll struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	CreatorID string             `json:"creatorId" bson:"creatorId"` 
	Question string             `json:"question" bson:"question"`
	Options  []Option           `json:"options" bson:"options"`
	Status   string             `json:"status" bson:"status"`
}
