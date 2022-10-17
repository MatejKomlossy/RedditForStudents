package upload_export_files

import (
	h "backend/helper"
	"backend/paths"
	"backend/signature"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"os"
	"strconv"
)

//exportFile handle for release skill-matrix according:
//  - id of superior
//  - format of output
func exportFile(ctx *gin.Context) {
	const nameFunc = "exportFile"
	name, format, err := exportSkillMatrixReturnNameFormat(ctx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, nameFunc, ctx)
		return
	}
	nameFormat := h.MyStrings{
		First:  name,
		Second: format,
	}
	err = copyFile(ctx, nameFormat)
	if nil != err {
		h.WriteErrWriteHandlers(err, packages, nameFunc, ctx)
		return
	}
}

//exportSkillMatrixReturnNameFormat do:
//  - fetch id and format
//  - run python script
//  - return name and format or error
func exportSkillMatrixReturnNameFormat(ctx *gin.Context) (string, string, error) {
	idString := ctx.Param("id")
	formatString := ctx.Param("format")
	if len(idString) == 0 || len(formatString) == 0 {
		return "", "", fmt.Errorf("do not contains id or format, it must contains both")
	}
	h.MkDirIfNotExist(h.Exports)
	err := saveJson(idString)
	if err != nil{
		return "", "", err
	}
	name, err := h.RunPythonScript("export.py", idString, formatString)
	if err != nil {
		return "", "", err
	}
	return fmt.Sprint(name), formatString, nil
}

//saveJson fetch skill-matrix from database and save to json
func saveJson(idString string) error {
	const name = "saveJson"
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil || id == 0 {
		return err
	}
	modify, err := signature.FetchMatrix(id)
	if err != nil {
		return fmt.Errorf("empty documents")
	}
	file, err := os.Create(fmt.Sprint(imports, "/", dirJson, "/", id, ".json"))
	if err != nil || file==nil{
		return err
	}
	b, err := json.Marshal(modify)
	if err != nil {
		errClose := file.Close()
		if errClose != nil {
			h.WriteMassageAsError(errClose, packages,name )
		}
		return err
	}
	_, err = file.Write(b)
	if err != nil {
		errClose := file.Close()
		if errClose != nil {
			h.WriteMassageAsError(errClose, packages,name )
		}
		return err
	}
	err = file.Close()
	return err
}

// copyFile send file to client by octet-stream
func copyFile(ctx *gin.Context, nameFormat h.MyStrings) (err error) {
	const Exports = "exports"
	fpath := paths.GlobalDir + Exports + "/" + nameFormat.First
	outfile, err := os.OpenFile(fpath, os.O_RDONLY, 0x0444)
	if err != nil {
		return
	}
	fi, err := outfile.Stat()
	if err != nil {
		return
	}
	ctx.Writer.Header().Set("Content-Disposition",
		"attachment; filename="+nameFormat.First)
	ctx.Writer.Header().Set("Content-Type", "application/octet-stream")
	ctx.Writer.Header().Set("Content-Length", fmt.Sprint(fi.Size()))
	_, err = io.Copy(ctx.Writer, outfile)
	return
}
