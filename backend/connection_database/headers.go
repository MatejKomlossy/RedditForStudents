package connection_database

import (
	h "backend/helper"
	"github.com/gin-gonic/gin"
	"net/http"
)

// SetHeadersReturnIsContinue
// give allow to all headers: set 'Access-Control-Allow-Origin' to '*'
func SetHeadersReturnIsContinue(ctx *gin.Context) bool {
	ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	if ctx.Request.Method == "OPTIONS" {
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization") // You can add more headers here if needed
		return false
	}
	return true
}

// AddHeaderPost
// add header with path to package's variable 'myRouter' like post method, function f will listen on path
func AddHeaderPost(path string, function func(ctx *gin.Context)) {
	myRouter.POST(path, preAuthFunc(function))
}

// AddHeaderGetID
// add header with path to package's variable 'myRouter' like get method, function f will listen on path with ending '/id', where 'id' is number
func AddHeaderGetID(path string, function func(ctx *gin.Context)) {
	myRouter.GET(path+"/:id", preAuthFunc(function))
}

// AddHeaderGet add header with path to package's variable 'myRouter' like get method, function f will listen on path
func AddHeaderGet(path string, function func(ctx *gin.Context)) {
	myRouter.GET(path, preAuthFunc(function))
}

// SendWithOk
// set 'Content-Type' of writer http.ResponseWriter header to 'application/json' and send StatusOK
func SendWithOk(ctx *gin.Context, responseStruct interface{}) {
	ctx.JSON(http.StatusOK, responseStruct)
}

// SendAccept send json {"accept", id} to writer http.ResponseWriter and send 'ok-header'
func SendAccept(id uint64, ctx *gin.Context) {
	responseStruct := h.Accept{Message: h.AgreementMessageAccept, Id: id}
	SendWithOk(ctx, responseStruct)
}

// SendDifferentResponse send json {custom_string, 0} to writer http.ResponseWriter and send 'ok-header'
func SendDifferentResponse(isWarning bool, msg string, ctx *gin.Context) {
	responseStruct := struct {
		IsWarning bool
		Msg string
	}{isWarning, msg}
	SendWithOk(ctx, responseStruct)
}