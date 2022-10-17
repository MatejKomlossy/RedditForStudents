package employee

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func login(ctx *gin.Context) {
		rw := DataWR{
			S: &h.MyStrings{
				First: Login,
				Second: PasswordColumn,
			},
			Ctx: ctx,
		}
		loginBy(rw)
}

func loginBy(rw DataWR) {
	const name = "loginBy"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, rw.Ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	err, loginName := rw.BuildQuery(passwd)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, rw.Ctx)
		return
	}
	var e Employee
	re := tx.Where(rw.S.Query).First(&e)
	if re.Error != nil {
		con.AddWarning(loginName)
		h.WriteErrWriteHandlers(re.Error, packages, name, rw.Ctx)
		return
	}
	con.SendWithOk(rw.Ctx, e)
}
