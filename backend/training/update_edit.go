package training

import (
	con "backend/connection_database"
	h "backend/helper"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

func updateEditedTraining(ctx *gin.Context) {
	const name = "updateEditedTraining"
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
	err := tx.Model(&newTraining).
		Select("*").
		Omit("edited").
		Updates(&newTraining).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendAccept(newTraining.Id, ctx)
}
