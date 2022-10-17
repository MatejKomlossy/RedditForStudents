package languages

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func listAll(ctx *gin.Context) {
	files := make([]string, 0, 10)
	err := filepath.Walk(dir, visit(&files))
	if err != nil || len(files) == 0 {
		h.WriteErrWriteHandlers(err, packages, "listAll", ctx)
		return
	}
	jsonResult := struct {
		Data []string `json:"data"`
	}{files}
	con.SendWithOk(ctx, jsonResult)
}

func visit(files *[]string) filepath.WalkFunc {
	return func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Fatal(err)
		}
		x := strings.Split(info.Name(), ".")
		if len(x) == 2 && strings.EqualFold(x[1], "json") {
			*files = append(*files, x[0])
		}
		return nil
	}
}

func readOne(ctx *gin.Context) {
	const name = "readOne"
	language := ctx.Param(languageSymbol)
	if len(language) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("unrecognized language in label 'language'"),
			packages, name, ctx)
		return
	}
	file, e := ioutil.ReadFile(fmt.Sprint(dir, language, ".json"))
	if e != nil {
		h.WriteErrWriteHandlers(e, packages, name, ctx)
		return
	}
	jsonResult := struct {
		Data string `json:"data"`
	}{string(file)}
	con.SendWithOk(ctx, jsonResult)
}
