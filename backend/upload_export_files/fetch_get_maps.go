package upload_export_files

import (
	"backend/employee"
	h "backend/helper"
	"fmt"
	"gorm.io/gorm"
	"strings"
	"sync"
)

//getMapsIdFromImportDb create 4 map to mapping rows strings to id, it make for "branches", "cities", "departments", "divisions" and managers
func getMapsIdFromImportDb(array [][]string, tx *gorm.DB) (map[string]uint64, map[string]uint64, map[string]uint64, map[string]uint64, map[string]uint64 ) {
	banchMap, cityMap, departmentMap, divisionMap, superiorMap := make(map[string]uint64),
		make(map[string]uint64), make(map[string]uint64), make(map[string]uint64), make(map[string]uint64)
	for i := 0; i < len(array); i++ {
		row := array[i]
		banchMap[row[config.Branch]] = 0
		cityMap[row[config.City]] = 0
		departmentMap[row[config.Department]] = 0
		divisionMap[row[config.Division]] = 0
		superiorMap[row[config.Manager]] = 0
	}
	ch := make(chan bool)
	mux := &sync.Mutex{}
	fnFethIdForMap := prepareFethIdForMap(ch, tx, mux)
	go fnFethIdForMap(banchMap, "branches")
	go fnFethIdForMap(cityMap, "cities")
	go fnFethIdForMap(departmentMap, "departments")
	go fnFethIdForMap(divisionMap, "divisions")
	h.Synchronize(ch, 4)
	return banchMap, cityMap, departmentMap, divisionMap, superiorMap
}
//fetchIdManager fill map with tuples (anetId and id)
func fetchIdManager(superiorMap map[string]uint64, tx *gorm.DB, mux *sync.Mutex) error {
	array := getArrayOfKeys(superiorMap)
	Query := fmt.Sprint(employeesIdAnetId)
	Query = strings.ReplaceAll(Query, "Query",
		fmt.Sprint("('", strings.Join(array, "', '"), "')"))
	var idName []h.NameId
	mux.Lock()
	err := tx.Raw(Query).First(&idName).Error
	mux.Unlock()
	if err != nil {
		h.WriteMassageAsError(err, packages, "anonim from prepareFillMapByResultQuery")
		return err
	}
	for i := 0; i < len(idName); i++ {
		one := idName[i]
		superiorMap[one.Name] = one.Id
	}
	if len(idName) < len(array) {
		err = getEFUUserIdsWithNullIds(superiorMap)
	}
	return err
}

func getEFUUserIdsWithNullIds(superiorMap map[string]uint64) error {
	var stringBuilderErr strings.Builder
	stringBuilderErr.WriteString(
		"Superiors of some employees are not in database yet.")
	stringBuilderErr.WriteString(
		" You need to repeat this import later when they will be.")
	stringBuilderErr.WriteString(
		" the missing User ID are: ")
	for s, u := range superiorMap {
		if u == 0 {
			stringBuilderErr.WriteString(s)
			stringBuilderErr.WriteString(",")
		}
	}
	return fmt.Errorf(strings.Trim(stringBuilderErr.String(), ","))
}

//prepareFethIdForMap Middleware for prepare/return func to fill map according table
func prepareFethIdForMap(ch chan bool, tx *gorm.DB, mux *sync.Mutex) func(mapId map[string]uint64, table string) {
	return func(mapId map[string]uint64, table string) {
		array := getArrayOfKeys(mapId)
		importIdQuery := fmt.Sprint(insertSelectIdByName)
		importIdQuery = strings.ReplaceAll(importIdQuery, "NameTable",
			fmt.Sprint("\"", table, "\""))
		arrayJoin := strings.Join(array, "', '")
		importIdQuery = strings.Replace(importIdQuery, "MyInseredName",
			fmt.Sprintf(" any (array['%v'])", arrayJoin), 1)
		importIdQuery = strings.ReplaceAll(importIdQuery, "MyInseredName",
			fmt.Sprintf("* from\n unnest(ARRAY['%v'])", arrayJoin))
		fn := prepareFillMapByResultQuery(mux, tx)
		_ = fn(mapId, importIdQuery)
		ch <- true
	}
}

//prepareFillMapByResultQuery Middleware for prepare/return func to fill map according query
func prepareFillMapByResultQuery(mux *sync.Mutex, tx *gorm.DB) func(mapId map[string]uint64, query string) error {
	return func(mapId map[string]uint64, query string) error {
		var idName []h.NameId
		mux.Lock()
		err := tx.Raw(query).First(&idName).Error
		mux.Unlock()
		if err != nil {
			h.WriteMassageAsError(err, packages, "anonim from prepareFillMapByResultQuery")
		} else {
			for i := 0; i < len(idName); i++ {
				one := idName[i]
				mapId[one.Name] = one.Id
			}
		}
		return err
	}
}

// getImportId take name X.Y.Z.csv and run fethIdByNameFromDb to search id for X.Y.Z
func getImportId(name string, tx *gorm.DB) (uint64, error) {
	array := strings.Split(name, ".")
	if len(array) < 2 {
		return 0, fmt.Errorf("untaped - unsiutable name")
	}
	arrayJoin := strings.Join(array[:len(array)-1], ".")
	return fethIdByNameFromDb(arrayJoin, tx)
}

// fethIdByNameFromDb search id by name, if do not exist create(this function provide SQL command in importIdQuery)
func fethIdByNameFromDb(importName string, tx *gorm.DB) (uint64, error) {
	importIdQuery := fmt.Sprint(insertSelectIdByName)
	importIdQuery = strings.ReplaceAll(importIdQuery, "NameTable", "\"imports\"")
	prepareName := fmt.Sprintf("'%v'", importName)
	importIdQuery = strings.ReplaceAll(importIdQuery, "MyInseredName", prepareName)
	importIdQuery = strings.ReplaceAll(importIdQuery, "as insertMy", "")
	importIdQuery = strings.ReplaceAll(importIdQuery, "insertMy", prepareName)
	var id h.NameId
	result := tx.Raw(importIdQuery).First(&id)
	if result.Error != nil {
		return 0, result.Error
	}
	return id.Id, nil
}

//getMapAllEmployeesFromLastImport crate map with anetId like key and database id like value
func getMapAllEmployeesFromLastImport(id uint64) map[string]uint64 {
	query := employeesSelectByImport
	query = strings.ReplaceAll(query, "MyId", fmt.Sprint(id))
	result := make(map[string]uint64)
	employeeAllByImportId, err := employee.GetEmployeesByQuery(query)
	if err != nil {
		return result
	}
	for i := 0; i < len(employeeAllByImportId); i++ {
		emp := employeeAllByImportId[i]
		result[emp.AnetId] = emp.Id
	}
	return result
}