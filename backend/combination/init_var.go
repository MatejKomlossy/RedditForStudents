package combination

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/paths"
)

// queryCombinationAll local variable of SQL command for all actual combinations
var queryCombinationAll string

// dir local constant to load txt files
const (
	packages = "combination"
	dir      = paths.GlobalDir + packages + paths.Scripts
)

// init0 init queryCombinationAll from dir+"combinations.sql"
func init0() {
	queryCombinationAll = h.ReturnTrimFile(dir + "combinations.sql")
}

// AddHandleInitVars register handles and init local variables
func AddHandleInitVars() {
	init0()
	con.AddHeaderGet(paths.Combinations, sendAll)
	con.AddHeaderGet(paths.Branches, sendAllBranches)
	con.AddHeaderGet(paths.Cities, sendAllCities)
	con.AddHeaderGet(paths.Departments, sendAllDepartments)
	con.AddHeaderGet(paths.Divisions, sendAllDivisions)
}
