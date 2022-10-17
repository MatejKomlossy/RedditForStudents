package upload_export_files

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"mime/multipart"
	"os"
	"strings"
)

//upload handle for uploading data to database
func upload(ctx *gin.Context) {
	const name = "upload"
	err := ctx.Request.ParseMultipartForm(h.GB2)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	file, fileHeader, err := ctx.Request.FormFile("file")
	defer h.CloseMultiPathFileIfExist(file)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	importName := ctx.Request.FormValue("import")
	pathName := carryPathName(fileHeader, importName)
	fatalErr, warnings := saveParseDeleteFile(file, pathName)
	if fatalErr != nil {
		h.WriteErrWriteHandlers(fmt.Errorf("dont be upload because: %v", fatalErr),
			dir, packages, ctx)
		return
	}
	sendOkWithOrWithoutWarnings(warnings, ctx)
}

func sendOkWithOrWithoutWarnings(warnings error, ctx *gin.Context) {
	if warnings == nil {
		con.SendDifferentResponse(false, "", ctx)
		return
	}
	con.SendDifferentResponse(true, warnings.Error(), ctx)
}


//carryPathName return import-path cards or employees according importName
func carryPathName(fileHeader *multipart.FileHeader, importName string) string {
	if len(importName) != 0 {
		return fmt.Sprint(employeesPath, importName, ".csv")
	}
	return fmt.Sprint(cardsPath, fileHeader.Filename)
}

//saveParseDeleteFile save run parse-csv and clean file
func saveParseDeleteFile(file multipart.File, pathName string) (error, error) {
	if !strings.HasSuffix(pathName, ".csv") {
		return fmt.Errorf("bad format"), nil
	}
	err := copyToLocal(file, pathName)
	if err != nil {
		return err, nil
	}
	fatalErr, warning := process( pathName)
	return fatalErr, warning
}

func copyToLocal(file multipart.File, pathName string) error {
	f, err := os.OpenFile(pathName, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 777)
	defer h.CloseFileIfExist(f)
	if err != nil {
		return fmt.Errorf("internal error, %v", err)
	}
	_, err = io.Copy(f, file)
	if err != nil {
		return fmt.Errorf("internal error, %v", err)
	}
	err = f.Close()
	if err != nil {
		return fmt.Errorf("internal error, %v", err)
	}
	return nil
}

func process(pathName string) (error, error) {
	err, warnings := parse(pathName)
	go deleteFile(pathName)
	return err, warnings
}

func deleteFile(pathName string) {
	err := os.Remove(pathName)
	if err != nil {
		h.WriteMassageAsError(err, packages, "deleteFile")
	}
}
