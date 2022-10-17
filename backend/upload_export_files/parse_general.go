package upload_export_files

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"path/filepath"
)

//parse according pathName to file run parseCards to save cards to database or parseSaveEmployeesAddSign to save employees to database
func parse(pathName string) (error, error) {
	path, name := filepath.Split(pathName)
	if path == cardsPath {
		return parseCards(pathName), nil
	}
	return parseSaveEmployeesAddSign(path, name)
}

func addOnConflict(tx *gorm.DB) {
	tx.Statement.AddClause(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns(columns),
	})
	tx.Statement.AddClause(clause.OnConflict{
		Columns:   []clause.Column{{Name: "anet_id"}},
		DoUpdates: clause.AssignmentColumns(columns),
	})
}