package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

//createConfirmDoc handle for create document and set edited = false
func createConfirmDoc(ctx *gin.Context) {
	const name = "createConfirmDoc"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	id, err := doCreate(ctx, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	err = doConfirm(id, tx)
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
