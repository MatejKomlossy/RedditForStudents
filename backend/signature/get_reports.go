package signature

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/signature/fake_structs"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
	"strings"
)

func getDocumentReport(ctx *gin.Context) {
	const name = "getDocumentReport"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	query, ok := fetchId(ctx)(name, queryRecursiveVersionDocuments)
	if ok == false {
		return
	}
	reports := &fake_structs.Reports{}
	err := tx.Raw(query).
		Find(&reports.EmployeeSignature).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(fmt.Errorf("empty report"), packages, name, ctx)
		return
	}
	realR := convertFromFakeReport(reports)
	modify := realR.convertToModifyReport()
	if len(modify.DocumentSignature) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("empty report"), packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, modify.DocumentSignature)
}

func getTrainingReport(ctx *gin.Context) {
	const name = "getTrainingReport"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	query, ok := fetchId(ctx)(name, queryOnlineTrainingEmployees)
	if ok == false {
		return
	}
	reports := &fake_structs.Reports{}
	err := tx.Raw(query).
		Find(&reports.OnlineSignature).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(fmt.Errorf("empty report"), packages, name, ctx)
		return
	}
	realR := convertFromFakeReport(reports)
	modify := realR.convertToModifyReport()
	if len(modify.OnlineSignature) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("empty report"), packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, modify.OnlineSignature[0])
}

func fetchId(ctx *gin.Context) func(name, query string) (resultQuery string, ok bool) {
	return func(name, query string) (resultQuery string, ok bool) {
		idString := ctx.Param("id")
		ok = len(idString) != 0
		if !ok {
			h.WriteErrWriteHandlers(fmt.Errorf("do not find id"), packages, name, ctx)
			return
		}
		id, err := strconv.ParseUint(idString, 10, 64)
		if err != nil {
			h.WriteMassageAsError(fmt.Sprint(
				"id is not uint64, ", err), packages, "anonim in fetchId")
			return "", false
		}
		resultQuery = strings.Replace(query, "?",
			fmt.Sprint(id), 1)
		return
	}
}
