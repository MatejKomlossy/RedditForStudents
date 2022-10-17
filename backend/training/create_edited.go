package training

import (
	con "backend/connection_database"
	h "backend/helper"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

func createEditedTraining(ctx *gin.Context) {
	const name = "createEditedTraining"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var newTraining OnlineTraining
	e := json.NewDecoder(ctx.Request.Body).Decode(&newTraining)
	if e != nil {
		h.WriteErrWriteHandlers(e, packages, name, ctx)
		return
	}
	result := tx.
		Omit("edited", "old").
		Create(&newTraining)
	if result.Error != nil {
		h.WriteErrWriteHandlers(result.Error, packages, name, ctx)
		return
	}
	con.SendAccept(newTraining.Id, ctx)
}
