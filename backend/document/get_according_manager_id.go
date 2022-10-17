package document

import (
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
)

// getManagerDoc use filterDoc
func getManagerDoc(ctx *gin.Context) {
	const name = "getManagerDoc"
	query, err := buildQueryByIdManager(ctx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	docs, err := getCompletnessByQuery(query)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	sendDocsOrErr(docs, ctx, name)
}

func buildQueryByIdManager(ctx *gin.Context) (string, error) {
	const idLabel = "id"
	idString := ctx.Param(idLabel)
	if len(idString) ==0 {
		return "", fmt.Errorf("I not found %v", idLabel)
	}
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf(accordingManager, id, id), nil
}
