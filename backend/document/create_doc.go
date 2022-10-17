package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//createDoc handle for create create new document
func createDoc(ctx *gin.Context) {
	const name = "createDoc"
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
	err = tx.Commit().Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendAccept(id, ctx)
}

//doCreate fetch document from request *http.Request and write to db by transaction tx *gorm.DB with edited = true
func doCreate(ctx *gin.Context, tx *gorm.DB) (uint64, error) {
	var doc Document
	e := json.NewDecoder(ctx.Request.Body).Decode(&doc)
	if e != nil {
		return 0, e
	}
	e = controlIdIfExistSetPrewVersionUpdateOld(&doc, tx)
	if e != nil {
		return 0, e
	}
	doc.Edited = true
	err := tx.Create(&doc).
		Error
	if err != nil {
		return 0, err
	}
	return doc.Id, nil
}

//controlIdIfExistSetPrewVersionUpdateOld set  Document "old" = true by id then set predVersionId = id and then id = 0
func controlIdIfExistSetPrewVersionUpdateOld(d *Document, tx *gorm.DB) error {
	if d.Id == 0 {
		return nil
	}
	err := tx.Model(&Document{Id: d.Id}).
		Updates(map[string]interface{}{"old": true}).
		Error
	d.PrevVersionId = d.Id
	d.Id = 0
	return err
}
