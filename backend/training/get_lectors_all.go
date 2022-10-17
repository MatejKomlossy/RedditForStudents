package training

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func getLectorsAll(ctx *gin.Context) {
	const name = "getLectorsAll"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	result := make([]string, 500)
	err := tx.Raw(lectorAll).Find(&result).Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, result)
}
