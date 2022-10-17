package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
)

func sendDocsOrErr(docs []DocumentComplete, ctx *gin.Context, caller string) {
	const name = "sendDocsOrErr"
	if docs != nil && len(docs)>0{
		con.SendWithOk(ctx, docs)
	} else {
		h.WriteErrWriteHandlers(fmt.Errorf("docs is nul"),
			packages, name+" call by "+caller, ctx)
	}
}
