package employee

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/paths"
	"encoding/json"
	"fmt"
)

var (
	passwd                                  *h.PasswordConfig
	queryAllEmployees, queryFilterEmployees, queryIdsEmployees string
)

const (
	packages = "employee"
	dir      = paths.GlobalDir + packages + paths.Scripts
)

func init0() {
	x := dir + "password_allow.txt"
	stringConfig := h.ReturnTrimFile(x)
	err := json.Unmarshal([]byte(stringConfig), &passwd)
	h.Check(err, x)
	queryAllEmployees = h.ReturnTrimFile(dir + "all_employees.sql")
	queryFilterEmployees = h.ReturnTrimFile(dir + "filter_employees.sql")
	queryIdsEmployees = h.ReturnTrimFile(dir+"employees_by_ids.sql")
}

func AddHandleInitVars() {
	init0()
	con.AddHeaderPost(paths.Login, login)
	con.AddHeaderPost(paths.Kiosk, kiosk)
	con.AddHeaderGet(paths.AllEmployees, getAll)
	con.AddHeaderPost(paths.ByIdsEmployees,	getByIds)
	con.AddHeaderGet(fmt.Sprint(paths.FilterEmployees, "/:filter"), getFiltered)
}

