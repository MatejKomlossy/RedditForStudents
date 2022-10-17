package employee

import (
	h "backend/helper"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"
)

func getByIds(ctx *gin.Context) {
	const name =  "getByIds"
	var mapFilter map[string]string
	err := json.NewDecoder(ctx.Request.Body).Decode(&mapFilter)
	if mapFilter == nil || len(mapFilter)==0{
		h.WriteErrWriteHandlers(fmt.Errorf("some internal error" +
			": empty map"), packages, name, ctx)
		return
	}
	idsString, ok := mapFilter["ids"]
	if idsString == "" || !ok {
		h.WriteErrWriteHandlers(fmt.Errorf("not found 'ids'"),
			packages, name, ctx)
		return
	}
	ids := make([]uint64, 0, 10)
	err = json.Unmarshal([]byte(idsString), &ids)
	if err != nil || ids == nil {
		h.WriteErrWriteHandlers(fmt.Errorf("'ids' must be array of uint64"),
			packages, name, ctx)
		return
	}
	queryFilterEmployeesPrepared := strings.Replace(queryIdsEmployees,
		"Query1", h.ArrayUint64ToString(ids, ", "), 1)
	sendByScript(ctx, queryFilterEmployeesPrepared)
}
