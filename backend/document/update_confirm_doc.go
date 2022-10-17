package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func updateConfirmDoc(ctx *gin.Context) {
	const name = "updateConfirmDoc"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	ok, id := doUpdate(ctx, tx)
	if !ok {
		return
	}
	err := doConfirm(id, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	err = tx.Commit().Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendAccept(id, ctx)
}
