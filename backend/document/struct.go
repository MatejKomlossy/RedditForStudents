package document

import (
	"database/sql"
)

type Document struct {
	Id              uint64       `gorm:"primaryKey" json:"id"`
	Name            string       `gorm:"column:name" json:"name"`
	Link            string       `gorm:"column:link" json:"link"`
	Note            string       `gorm:"column:note" json:"note"`
	Type            string       `gorm:"column:type" json:"type"`
	ReleaseDate     sql.NullTime `gorm:"column:release_date" json:"release_date"`
	Deadline        sql.NullTime `gorm:"column:deadline" json:"deadline"`
	OrderNumber     uint64       `gorm:"column:order_number" json:"order_number"`
	Version         string       `gorm:"column:version" json:"version"`
	PrevVersionId   uint64       `gorm:"column:prev_version_id" json:"prev_version_id"`
	Assigned        string       `gorm:"column:assigned_to" json:"assigned_to"`
	RequireSuperior bool         `gorm:"column:require_superior" json:"require_superior"`
	Edited          bool         `gorm:"column:edited" json:"edited"`
	Old             bool         `gorm:"column:old" json:"old"`
}

type DocumentComplete struct {
	Document
	Complete float64 `gorm:"column:percentage" json:"complete"`
}

func (DocumentComplete) TableName() string {
	return "documents"
}
