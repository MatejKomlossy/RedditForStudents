package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"strconv"
	"strings"
)

//confirmDoc handle for change edited to false according id from request
func confirmDoc(ctx *gin.Context) {
	const name = "confirmDoc"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	idString := ctx.Param("id")
	if len(idString) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("not found 'id'"), packages, name, ctx)
		return
	}
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	err = doConfirm(id, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	tx.Commit()
	con.SendAccept(id, ctx)
}

//doConfirm change edited to false according id
func doConfirm(id uint64, tx *gorm.DB) (err error) {
	var respon h.StringsBool
	tmp := strings.ReplaceAll(confirm, "?", fmt.Sprint(id))
	re := tx.Raw(tmp).Find(&respon)
	err = re.Error
	if err != nil {
		return
	}
	return AddSignature(respon, id, tx)
}
