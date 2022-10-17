package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func updateDoc(ctx *gin.Context) {
	const name = "updateDoc"
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
	con.SendAccept(id, ctx)
}

func doUpdate(ctx *gin.Context, tx *gorm.DB) (bool, uint64) {
	const name = "doUpdate"
	var doc Document
	err := json.NewDecoder(ctx.Request.Body).Decode(&doc)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return false, 0
	}
	err	= tx.Model(&doc).
		Select("*").
		Omit("edited", "old", "prev_version_id").
		Updates(&doc).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return false, 0
	}
	return true, doc.Id
}
