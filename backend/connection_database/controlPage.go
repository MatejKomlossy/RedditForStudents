package connection_database

import (
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

//controlPage handler for control running server
func controlPage(ctx *gin.Context) {
	SendAccept(h.AgreementIdServerClient, ctx)
}
