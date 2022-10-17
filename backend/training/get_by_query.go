package training

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func sendTrainingByQuery(ctx *gin.Context, query string) error {
	tx, dbErr := con.GetDatabaseConnection()
	const name = "sendTrainingByQuery"
	if dbErr != nil {
		return dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	var docs []OnlineTrainingComplete
	err := tx.Raw(query).Find(&docs).Error
	if err != nil {
		return err
	}
	con.SendWithOk(ctx, docs)
	return nil
}
