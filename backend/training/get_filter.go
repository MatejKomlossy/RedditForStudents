package training

import (
	h "backend/helper"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
)

func getFilterTraining(ctx *gin.Context) {
	const name ="getFilterTraining"
	queryFiltered, err := getFilteredQueryTrainings(ctx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	err = sendTrainingByQuery(ctx, queryFiltered)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
}
}

type filter struct {
	IdEmployee interface{}
	Lector     interface{}
}

func (f *filter) MakeQuery() string {
	query := filterTraining
	const condition1 = "exists(select training_id from online_training_signatures where " +
		"employee_id||'' = '%v' and training_id = online_trainings.id)"
	const condition2 = "lector||'' = '%v'"
	query = h.ReplaceIfNotNilAddAndIfIsAncestor(condition1, query)(f.IdEmployee, "Query1")
	query = h.ReplaceIfNotNilAddAndIfIsAncestor(condition2, query)(f.Lector, "Query2")
	return query
}

func (f *filter) fill(mapFilter map[string]interface{}) error {
	const lector, employee = "lector", "employee"
	interfaceLector, okLector := mapFilter[lector]
	interfaceIdEmployee, okIdEmployee := mapFilter[employee]
	if okLector == false && okIdEmployee == false {
		return fmt.Errorf("not found fields '%v' or '%v'", lector, employee)
	}
	f.Lector = interfaceLector
	f.IdEmployee = interfaceIdEmployee
	return nil
}

func getFilteredQueryTrainings(ctx *gin.Context) (string, error) {
	var mapFilter map[string]interface{}
	err := json.NewDecoder(ctx.Request.Body).Decode(&mapFilter)
	if err != nil {
		return "", err
	}
	var filtter filter
	err = filtter.fill(mapFilter)
	if err != nil {
		return "", err
	}
	return filtter.MakeQuery(), nil
}
