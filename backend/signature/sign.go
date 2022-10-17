package signature

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
	"strconv"
)

func signSuperior(ctx *gin.Context) {
		signCommon(ctx, querySignSuperior)
}

func sign(ctx *gin.Context) {
		signCommon(ctx, querySign)
}

func signTraining(ctx *gin.Context) {
		signCommon(ctx, querySignTraining)
}

func signCommon(ctx *gin.Context, q string) {
	const name = "signCommon"
	x := ctx.Request.FormValue("id")
	id, err := strconv.ParseUint(x+"", 10, 64)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var messange string
	result := tx.Raw(q, id).Find(&messange)
	if result.Error != nil {
		h.WriteErrWriteHandlers(result.Error, packages, name, ctx )
		return
	}
	con.SendAccept(id, ctx)
}
