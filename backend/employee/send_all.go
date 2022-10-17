package employee

import (
	"github.com/gin-gonic/gin"
)

func getAll(ctx *gin.Context) {
	sendByScript(ctx, queryAllEmployees)
}
