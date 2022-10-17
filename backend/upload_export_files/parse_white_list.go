package upload_export_files

import (
	con "backend/connection_database"
	"backend/employee"
	h "backend/helper"
	"backend/mail"
	"backend/signature"
	"fmt"
	"gorm.io/gorm"
	"path/filepath"
	"strings"
	"sync"
)

//parseSaveEmployeesAddSign add employees to database and add them signatures
func parseSaveEmployeesAddSign(dir string, nameFile string) (error, error) {
	const name = "parseSaveEmployeesAddSign"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return dbErr, nil
	}
	defer h.FinishTransaktion(tx, packages,name)
	newEmployees, fatalErr, warnings := parseReadFileCareImportInDBSaveEmployeesReturnNew(dir, nameFile, tx)
	if fatalErr != nil {
		h.WriteMassageAsError(fatalErr, packages, name)
		return fatalErr, warnings
	}
	if len(newEmployees) == 0 {
		fatalErr = tx.Commit().Error
		return fatalErr, warnings
	}
	emailsEmployees, err := signature.AddSignsNewEmployeesReturnsEmails(newEmployees, tx)
	if err != nil {
		h.WriteMassageAsError(err, packages, name)
		return err, warnings
	}
	fatalErr = tx.Commit().Error
	if fatalErr != nil {
		return fatalErr, warnings
	}
	go mail.SendWelcome(emailsEmployees)
	return nil, warnings
}

//parseReadFileCareImportInDBSaveEmployeesReturnNew read csv, write to database and return []h.NewEmployee or error
func parseReadFileCareImportInDBSaveEmployeesReturnNew(path string, name string, tx *gorm.DB) ([]h.NewEmployee, error, error) {
	fileArray, err := h.ReadCsvFile(filepath.Join(path, name))
	if err != nil {
		return nil, err, nil
	}
	id, err := getImportId(name, tx)
	if err != nil {
		return nil, err, nil
	}
	filteredArray, errFilter := filterEmptyName(fileArray)
	newEmployees, fatalErr, warnings := parseArraySaveAllEmployeesReturnNew(filteredArray, id, tx)
	warnings = h.ErrorTogether(errFilter, warnings)
	return newEmployees, fatalErr, warnings
}

//parseArraySaveAllEmployeesReturnNew prepare all for saved to database and run it
func parseArraySaveAllEmployeesReturnNew(fileArray [][]string, id uint64, tx *gorm.DB) ([]h.NewEmployee, error, error) {
	ch, mapAllEmployeesFromLastImport, mapSuperior, chWarnings := makeChanSendingEmployeesGetLastImport(fileArray, id, tx)
	createEmployees, updateEmployees, errDonotImport := catchEmployees(len(fileArray), ch, chWarnings)
	createOrUpdateFunc := prepareCreateOrUpdate(createEmployees, updateEmployees, mapSuperior)
	return createOrUpdateFunc(mapAllEmployeesFromLastImport, tx, errDonotImport)
}

//makeChanSendingEmployeesGetLastImport check all employees from last import end run parallel creating structs of employee.Employee,
//return chan for these structs and map of anetId and id
func makeChanSendingEmployeesGetLastImport(fileArray [][]string, id uint64, tx *gorm.DB) (chan *employee.Employee, map[string]uint64, map[string]uint64, chan error) {
	ch, mapAllEmployeesFromLastImport, chErr := make(chan *employee.Employee),
	getMapAllEmployeesFromLastImport(id), make(chan error)
	banchMap, cityMap, departmentMap, divisionMap, superiorMap := getMapsIdFromImportDb(fileArray, tx)
	for i := 0; i < len(fileArray); i++ {
		go func(row []string) {
			tempEmployee, ok := employee.NewEmptyEmployee(), false
			tempEmployee.ImportId, tempEmployee.Deleted = id, false
			ok = setGeneralIdFromStringIfExist(&mapAllEmployeesFromLastImport, func(id uint64) { tempEmployee.Id = id }, row[config.AnetId]) || ok
			ok = setGeneralIdFromStringIfExist(&banchMap, func(id uint64) { tempEmployee.BranchId = id }, row[config.Branch]) || ok
			ok = setGeneralIdFromStringIfExist(&cityMap, func(id uint64) { tempEmployee.CityId = id }, row[config.City]) || ok
			ok = setGeneralIdFromStringIfExist(&departmentMap, func(id uint64) { tempEmployee.DepartmentId = id }, row[config.Department]) || ok
			ok = setGeneralIdFromStringIfExist(&divisionMap, func(id uint64) { tempEmployee.DivisionId = id }, row[config.Division]) || ok
			setStrings(row, &tempEmployee)
			if !ok {
				warning := fmt.Errorf("employees %v has'nt got any of ids (branch, city, ...), therefore she/he has'nt be import",
					tempEmployee.FirstName+" "+tempEmployee.LastName+" "+tempEmployee.AnetId)
				h.WriteMassageAsError(warning,  packages, "makeChanSendingEmployeesGetLastImport")
				chErr <- warning
				return
			}
			ch <- &tempEmployee
		}(fileArray[i])
	}
	return ch, mapAllEmployeesFromLastImport, superiorMap, chErr
}

//catchEmployees collect employee.Employee from ch chan (and set attribute "deleted" to false), return:
//  - createEmployees: employees for create in database
//  - updateEmployees: employees for update in database
func catchEmployees(lenght int, ch chan *employee.Employee, chErr chan error) ([]*employee.Employee, []*employee.Employee, error) {
	updateEmployees := make([]*employee.Employee, 0, lenght)
	createEmployees := make([]*employee.Employee, 0, lenght)
	var warnings error
	for i := 0; i < lenght; i++ {
		select {
		case tempEmployee := <-ch:
			tempEmployee.Deleted = false
			if tempEmployee.Id == 0 {
				createEmployees = append(createEmployees, tempEmployee)
			} else {
				updateEmployees = append(updateEmployees, tempEmployee)
			}
		case TempErr :=<-chErr:
			warnings = h.ErrorTogether(warnings, TempErr)
		}
	}
	return createEmployees, updateEmployees, warnings
}

func setStrings(row []string, e *employee.Employee) {
	e.FirstName = row[config.FirstName]
	e.LastName = row[config.LastName]
	e.AnetId = row[config.AnetId]
	e.Login = row[config.Login]
	e.Password = h.Hash(row[config.Password])
	e.Role = row[config.Role]
	e.Email = row[config.Email]
	e.JobTitle = row[config.JobTitle]
	e.EFUUserId = row[config.EFUUserId]
	e.EFUUserIdManager = row[config.Manager]
}

//prepareCreateOrUpdate Middleware for prepare/return func to update old and create new record in database
func prepareCreateOrUpdate(create []*employee.Employee, update []*employee.Employee,
	superior map[string]uint64) func(lastImport map[string]uint64, tx *gorm.DB,
		errDontImport error) ([]h.NewEmployee, error, error) {
	common := append(update, create...)
	return func(lastImport map[string]uint64, tx *gorm.DB, errDontImport error) ([]h.NewEmployee, error, error) {
		if len(lastImport) > 0 {
			err2 := tx.Exec(buildDeletedQuery(lastImport)).Error
			if err2 != nil {
				h.WriteMassageAsError(err2, packages, "anonim from prepareCreateOrUpdate")
				return nil, err2, errDontImport
			}
		}
		err := createNewUpdateOld(tx, common)
		if err != nil {
			return nil, err, errDontImport
		}
		err = fetchIdManager(superior, tx, &sync.Mutex{})
		errDontImport = h.ErrorTogether(errDontImport, err)
		assignmentManagers(superior,common )
		err = createNewUpdateOld(tx, common)
		if err != nil {
			return nil, err, errDontImport
		}
		return employee.ConvertToNewEmployees(create), nil, errDontImport
	}
}

func assignmentManagers(superior map[string]uint64, common []*employee.Employee) {
	for i := 0; i < len(common); i++ {
		e := common[i]
		if Id, ok := superior[e.EFUUserIdManager]; ok {
			e.ManagerId = Id
		}
	}
}

func createNewUpdateOld(tx *gorm.DB, common []*employee.Employee) error {
	addOnConflict(tx)
	return tx.Create(&common).
		Error
}

// buildDeletedQuery from map fetch Ids and make string-SQL condition "anet_id in ('"+join(ids,", ")+")"
func buildDeletedQuery(lastImport map[string]uint64) string {
	array := make([]string, 0, len(lastImport))
	for k := range lastImport {
		array = append(array, k)
	}
	return fmt.Sprint("UPDATE \"employees\"", " SET deleted = true",
		" WHERE anet_id in ('", strings.Join(array, "', '"), "')")
}
