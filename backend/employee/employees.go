package employee

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func sendByScript(ctx *gin.Context, query string) {
	const name =  "sendByScript"
	e, err := GetEmployeesByQuery(query)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, e)
}

func GetEmployeesByQuery(query string) ([]Employee, error) {
	const name = "GetEmployeesByQuery"
	var e []Employee
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		return nil, dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	re := tx.Raw(query).Find(&e)
	return e, re.Error
}
