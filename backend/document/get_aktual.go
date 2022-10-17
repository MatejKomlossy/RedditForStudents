package document

import (
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

//aktualDoc handle for get actual documents use filterDoc
func aktualDoc(ctx *gin.Context) {
	const name = "aktualDoc"
	actualDoc := h.ReplaceIfNotNilAddAndIfIsAncestor(h.Empty, filterDoc)(h.Empty, "Query1")
	actualDoc = h.ReplaceIfNotNilAddAndIfIsAncestor(h.Empty, actualDoc)(h.Empty, "Query2")
	docs, err := getCompletnessByQuery(actualDoc)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	sendDocsOrErr(docs, ctx, name)
}
