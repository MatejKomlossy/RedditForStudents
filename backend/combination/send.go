package combination

import (
	con "backend/connection_database"
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

// sendAll handle for all actual combinations according queryCombinationAll local variable of SQL command
func sendAll(ctx *gin.Context) {
	const name = "sendAllStructs"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var combi []CombinationFull
	err := tx.Raw(queryCombinationAll).
		Find(&combi).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	con.SendWithOk(ctx, combi)
}

// sendAllBranches handle for all branches
func sendAllBranches(ctx *gin.Context) {
	const name = "branches"
	sendAllStructs(name, ctx)
}

// sendAllCities handle for all cities
func sendAllCities(ctx *gin.Context) {
	const name = "cities"
	sendAllStructs(name, ctx)
}

// sendAllDepartments handle for all departments
func sendAllDepartments(ctx *gin.Context) {
	const name = "departments"
	sendAllStructs(name, ctx)
}

// sendAllDivisions handle for all divisions
func sendAllDivisions(ctx *gin.Context) {
	const name = "divisions"
	sendAllStructs(name, ctx)
}

// sendAllStructs common send JSON: [(ID1, name1), (ID2, name2), ............]
func sendAllStructs(nameTable string, ctx *gin.Context) {
	const name = "sendAllStructs"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var result []IdName
	err := tx.Table(nameTable).
		Find(&result).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name+" call with "+nameTable, ctx)
		return
	}
	con.SendWithOk(ctx, result)
}
