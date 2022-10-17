package employee

import (
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func kiosk(ctx *gin.Context) {
	rw := DataWR{
		S: &h.MyStrings{
			First:  Card,
			Second: PasswordColumn,
		},
		Ctx: ctx,
	}
	loginBy(rw)
}
