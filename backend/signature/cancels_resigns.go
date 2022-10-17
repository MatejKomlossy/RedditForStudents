package signature
// TODO safety
import (
	con "backend/connection_database"
	h "backend/helper"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"

)

func cancel(ctx *gin.Context) {
	const name = "cancel"
	formatAndExecute(ctx, name, cancelSigns)
}

func resign(ctx *gin.Context) {
	const name = "resign"
	formatAndExecute(ctx, name, resigns)
}

func formatAndExecute(ctx *gin.Context, name, query string ) {
	var signs interface{}
	e := json.NewDecoder(ctx.Request.Body).Decode(&signs)
	if e != nil {
		h.WriteErrWriteHandlers(e, packages, name, ctx)
		return
	}
	queryCancel, err := formatQuery(signs, query)
	if executeIfNotErr(queryCancel, err) > 0 {
		con.SendAccept(0, ctx)
	} else {
		h.WriteErrWriteHandlers(fmt.Errorf(fmt.Sprint("nothing was execute", err)), packages, name, ctx)
	}
}
func executeIfNotErr(query string, err error) int {
	if err == nil {
		const name = "executeIfNotErr"
		tx, dbErr := con.GetDatabaseConnection()
		if dbErr != nil {
			h.WriteMassageAsError(dbErr, packages, name)
			return 0
		}
		defer h.FinishTransaktion(tx, packages,name)
		err = tx.Exec(query).
			Error
		if err == nil {
			return 1
		}
	}
	return 0
}

func formatQuery(interfaceArray interface{}, query string) (string, error) {
	if interfaceArray == nil {
		return "", fmt.Errorf("empty")
	}
	stringArray := fmt.Sprint(interfaceArray)
	array := h.FromStringToArrayUint64(stringArray)
	return strings.ReplaceAll(query, "?",
		fmt.Sprint("Array[ ", h.ArrayUint64ToString(array,","), " ]")), nil
}
