package document

import (
	h "backend/helper"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

// getFilterDoc handle for get documents with completness by filter use filterDoc
func getFilterDoc(ctx *gin.Context) {
	const name = "getFilterDoc"
	query, err := getQueryFilterDoc(ctx)
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


//getQueryFilterDoc prepare filter
func getQueryFilterDoc(ctx *gin.Context) (string, error) {
	var (
		doc   h.Filter
		myMap map[string]string
	)
	e := json.NewDecoder(ctx.Request.Body).Decode(&myMap)
	if e != nil {
		return "", e
	}
	doc.P = myMap
	return doc.BuildQuery(filterDoc), nil
}
