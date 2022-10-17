package signature

import (
	con "backend/connection_database"
	"backend/employee"
	h "backend/helper"
	"backend/signature/fake_structs"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
)

const (
	superiorId = iota
	employeeId
	documentId
	filter
)

var (
	mapName = map[string]uint{
		"superior_id": superiorId,
		"employee_id": employeeId,
		"document_id": documentId,
		"filter":      filter}
)

func getSkillMatrix(ctx *gin.Context) {
		which, err := defineWhich(ctx)
		if err != nil {
			h.WriteErrWriteHandlers(err, packages, "getSkillMatrix", ctx)
			return
		}
		doAcordingWhich(ctx, which)
}

func defineWhich(ctx *gin.Context) (uint, error) {
	for key, value := range mapName {
		got :=ctx.Request.FormValue(key)
		if got != "" {
			return value, nil
		}
	}
	return 1000, fmt.Errorf("unknown name request")
}

func doAcordingWhich(ctx *gin.Context, which uint) {
	var function func(ctx *gin.Context)
	switch which {
	case superiorId:
		function = prepareIdQuery("superior_id", skillMatrixSuperiorId)
	case employeeId:
		function = prepareIdQuery("employee_id", skillMatrixEmployeeId)
	case documentId:
		function = prepareIdQuery("document_id", skillMatrixDocumentId)
	case filter:
		function = prepareFilter(skillMatrixFilter)
	default:
		h.WriteErrWriteHandlers(fmt.Errorf("unimplemented which request"),
			packages, "doAcordingWhich", ctx)
		return
	}
	function(ctx)

}

func prepareFilter(query string) func(ctx *gin.Context) {
	const name = "prepareFilter"
	return func(ctx *gin.Context) {
		filterVant := ctx.Request.FormValue("filter")
		jsonMap := make(map[string]string)
		err := json.Unmarshal([]byte(filterVant), &jsonMap)
		if err != nil {
			h.WriteErrWriteHandlers(fmt.Errorf("do not find id"),
				packages, "anonim from prepareFilter", ctx)
			return
		}
		filter0 := h.Filter{P: jsonMap}
		query = filter0.BuildQuery(query)
		modify, err  := FetchMatrixByFilter(query)
		if err != nil {
			h.WriteErrWriteHandlers(err, packages, name, ctx)
			return
		}
		temp := ModifyDocumentsAdditionEmployees{
			Documents: modify.DocumentSignature,
			Employees: filterEmployees(modify),
		}
		con.SendWithOk(ctx, &temp)
	}
}

func filterEmployees(modify *ModifySignatures) []employee.Employee {
	map0 := make(map[uint64]*employee.Employee, len(modify.DocumentSignature)*10)
	for i := 0; i < len(modify.DocumentSignature); i++ {
		sing := modify.DocumentSignature[i].Sign
		for j := 0; j < len(sing); j++ {
			map0[sing[j].EmployeeId] = sing[j].Employee
		}
	}
	array := make([]employee.Employee, 0, len(map0))
	for _, e := range map0 {
		array = append(array, *e)
	}
	return array
}

func prepareIdQuery(nameId, query string) func(ctx *gin.Context) {
	const name = "prepareIdQuery"
	return func(ctx *gin.Context) {
		tempFloat := ctx.Request.FormValue(nameId)
		if tempFloat == "" {
			h.WriteErrWriteHandlers(fmt.Errorf("do not find id"),
				packages, name, ctx)
			return
		}
		id, err := strconv.ParseUint(tempFloat, 10, 64)
		if err != nil || id <= 0 {
			h.WriteErrWriteHandlers(err, packages, name, ctx)
			return
		}
		modify, err := FetchMatrixByIdQuery(id, query)
		if err != nil {
			h.WriteErrWriteHandlers(err, packages, name, ctx)
			return
		}
		temp := ModifyDocumentsAdditionEmployees{
			Documents: modify.DocumentSignature,
			Employees: filterEmployees(modify),
		}
		con.SendWithOk(ctx, &temp)
	}
}

func FetchMatrixByFilter(query string) (*ModifySignatures, error) {
	const name = "FetchMatrixByFilter"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		return nil, dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	signatures := &fake_structs.Signatures{}
	err := tx.Raw(query).Find(&signatures.EmployeeSignature).Error
	if err != nil {
		return nil, err
	}
	return convertSignatureFromFake(signatures).convertToModifySignature(), nil
}

func FetchMatrixByIdQuery(id uint64, query string) (*ModifySignatures, error)  {
	const name = "FetchMatrixByFilter"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return nil, dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	signatures := &fake_structs.Signatures{}
	err := tx.Raw(query, id).Find(&signatures.EmployeeSignature).Error
	if err != nil {
		return nil, err
	}
	return convertSignatureFromFake(signatures).convertToModifySignature(), nil
}
