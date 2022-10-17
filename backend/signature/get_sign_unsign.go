package signature

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/signature/fake_structs"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
)

func getUnsignedSignatures(ctx *gin.Context) {
	getSignatures(ctx, unsignedSigns)
}

func getSignedSignatures(ctx *gin.Context) {
	getSignatures(ctx, signedSigns)
}

func getSignatures(ctx *gin.Context, signs h.QueryThreeStrings) {
	const name = "getSignatures"
	idString := ctx.Param("id")
	if len(idString) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("do not find id"), packages, name, ctx)
		return
	}
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	modifySignature, err := getSignaturesByScript(signs, id)
	if err != nil{
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, modifySignature)
}

func getSignaturesByScript(Q h.QueryThreeStrings, id int) (*ModifySignatures, error) {
	const name = "getSignaturesByScript"
	signatures := &fake_structs.Signatures{}
	loaded := 3
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		return nil, dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	err := tx.Raw(Q.DocumentSignEmployee, id).
		Find(&signatures.EmployeeSignature).
		Error
	if err != nil {
		h.WriteMassageAsError(err, packages, name)
		loaded--
	}
	err = tx.Raw(Q.OnlineSign, id).
		Find(&signatures.OnlineSignature).
		Error
	if err != nil {
		h.WriteMassageAsError(err, packages, name)
		loaded--
	}
	err = tx.Raw(Q.DocumentSign, id).
		Find(&signatures.DocumentSignature).
		Error
	if err != nil {
		h.WriteMassageAsError(err, packages, name)
		loaded--
	}
	if loaded==3 || len(signatures.OnlineSignature)==0 && len(signatures.EmployeeSignature)==0 && len(signatures.DocumentSignature)==0 {
		return nil, fmt.Errorf("epmty loaded")
	}
	nonFake := convertSignatureFromFake(signatures)
	return nonFake.convertToModifySignature(), nil
}

func FetchMatrix(id uint64) (*ModifySignatures, error) {
	const name = "FetchMatrix"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return nil, dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	signatures := &fake_structs.Signatures{}
	err := tx.Raw(skillMatrixSuperiorId, id).
		Find(&signatures.EmployeeSignature).
		Error
	if err != nil {
		h.WriteMassageAsError(err, packages, name)
		return nil, dbErr
	}
	return convertSignatureFromFake(signatures).convertToModifySignature(), nil
}
