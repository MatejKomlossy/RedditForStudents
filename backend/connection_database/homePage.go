package connection_database

import (
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

// homePage send to writer home page contains all sub-domen
func homePage(ctx *gin.Context) {
	nav := buildNav(ctx.Request)
	ctx.Data(http.StatusOK, "text/html; charset=utf-8", []byte(fmt.Sprint(startPart, nav, endPart)))
}

// buildNav build html text home page
func buildNav(request *http.Request) string {
	var result strings.Builder
	for i := 0; i < len(homePageStringsMethod); i++ {
		method := homePageStringsMethod[i].Second
		wholeUrl := fmt.Sprint("http://",
			strings.TrimSpace(request.Host), homePageStringsMethod[i].First)
		result.WriteString(fmt.Sprintln(
			"<a class=\"active\" href=\"",
			wholeUrl,
			"\" style=\"display: block;\">",
			i+1, "link: ", wholeUrl,
			" method:", method,
			"</a>"))
	}
	return result.String()
}

// inithomePageString init package's variable homePageStringsMethod from actual package's variable myRouter
func inithomePageString() {
	for _, routeInfo := range myRouter.Routes() {
		homePageStringsMethod = append(homePageStringsMethod, h.MyStrings{
			First:  routeInfo.Path,
			Second: routeInfo.Method,
		})
	}
	h.SortAlphabeticallyByFirst(homePageStringsMethod)
}
