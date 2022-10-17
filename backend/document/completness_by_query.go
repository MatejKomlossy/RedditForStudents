package document

import (
	con "backend/connection_database"
	h "backend/helper"
)

//getCompletnessByQuery return from database documents, which have adding information about Completeness signature
func getCompletnessByQuery(query string) ([]DocumentComplete,error) {
	var docs []DocumentComplete
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		return docs, dbErr
	}
	defer h.FinishTransaktion(tx, packages,"getCompletnessByQuery" )
	err := tx.Raw(query).
		Find(&docs).
		Error
	return docs, err
}
