package upload_export_files

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/paths"
	"encoding/json"
	"fmt"
	"os"
)

const (
	imports       = "imports"
	card          = "employee_card"
	divisions     = "divisions"
	dirJson       = "json"
	employeesPath = paths.GlobalDir + imports + "/" + divisions + "/"
	cardsPath     = paths.GlobalDir + imports + "/" + card + "/"
	packages      = "upload_export_files"
	dir           = paths.GlobalDir + packages + paths.Scripts
)

var (
	config                                                           *csvConfig
	insertSelectIdByName, employeesSelectByImport, employeesIdAnetId string
	columns = []string{
		"deleted", "first_name", "last_name",
		"login", "role", "email", "efu_user_id",
		"job_title", "manager_id", "branch_id",
		"division_id", "department_id", "city_id",
		"import_id", "anet_id", "password"}
)

// AddHandleInitVars registr handler, init variables and dictionaries, WARNING: it can stop program with panic
func AddHandleInitVars() {
	init0()
	con.AddHeaderPost(paths.Upload, upload)
	con.AddHeaderGetID(fmt.Sprint(paths.Export, "/:format"), exportFile)
}

// init0 init variables and dictionaries, WARNING: it can stop program with panic
func init0() {
	initQuery()
	h.MkTree2DirsIfNotExist(imports, card)
	h.MkTree2DirsIfNotExist(imports, divisions)
	h.MkTree2DirsIfNotExist(imports, dirJson)
	initConfigIfNotExistOrLoad()
}

// initQuery init query scripts, WARNING: it can stop program with panic
func initQuery() {
	insertSelectIdByName = h.ReturnTrimFile(dir + "insert_select_id_by_name.sql")
	employeesSelectByImport = h.ReturnTrimFile(dir + "all_employees_from_imports.sql")
	employeesIdAnetId = h.ReturnTrimFile(dir + "employees_id_efu_user_id.sql")
}

// initConfigIfNotExistOrLoad if do not exist file with csvConfig, if exist load, WARNING: it can stop program with panic
func initConfigIfNotExistOrLoad() {
	config = newDefaultConfig()
	configFile := dir + "csv_config.json"
	f, err := os.Open(configFile)
	defer h.CloseFileIfExist(f)
	if err != nil {
		f, err = os.Create(configFile)
		if err != nil {
			panic(err)
		}
		err = json.NewEncoder(f).Encode(&config)
		if err != nil {
			panic(err)
		}
	} else {
		err = json.NewDecoder(f).Decode(&config)
		if err != nil {
			panic(err)
		}
	}
	config.setRightIndex()
}