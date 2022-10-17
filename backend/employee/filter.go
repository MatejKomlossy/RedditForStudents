package employee

import (
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"
)

func getFiltered(ctx *gin.Context) {
	const name =  "getFiltered"
	val := ctx.Param("filter")
	if len(val) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("not found 'filter'"), packages,name , ctx)
		return
	}
	queryFilterEmployeesPrepared := strings.ReplaceAll(queryFilterEmployees, "Query1",
		fmt.Sprint("'", val, "'"))
	sendByScript(ctx, queryFilterEmployeesPrepared)
}
