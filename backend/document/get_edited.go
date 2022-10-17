package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
)

func getEditedDoc(ctx *gin.Context) {
	sendDocByQuery(editedDoc, ctx)
}

func sendDocByQuery(query string, ctx *gin.Context) {
	const name ="sendDocByQuery"
	var docs []Document
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	re := tx.Raw(query).Find(&docs)
	if docs == nil {
		h.WriteErrWriteHandlers(fmt.Errorf("error: %v, or empty result", re.Error), packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, docs)
}
