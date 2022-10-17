package upload_export_files

import (
	conn "backend/connection_database"
	"backend/employee"
	h "backend/helper"
	"fmt"
	"strings"
)

//parseCards read csv and save to database
func parseCards(pathName string) error {
	fileArray, err := h.ReadCsvFile(pathName)
	if err != nil {
		h.WriteMassageAsError(err, packages, "parseCards")
		return err
	}
	return parseCardsFileArray(fileArray)
}

//parseCardsFileArray save to database
func parseCardsFileArray(array [][]string) error {
	const name = "parseCardsFileArray"
	var employees []employee.BasicEmployee
	tx, dbErr := conn.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return dbErr
	}
	defer h.FinishTransaktion(tx, packages,name)
	condition, mapAnetToPassword := getAnetIdsMapAnetIdToCard(array)
	err := tx.Model(&employees).Where(condition).Find(&employees).Error
	if err != nil {
		h.WriteMassageAsError(err, packages, name)
		return err
	}
	doUpages(employees, mapAnetToPassword)
	if len(employees) == 0 {
		return fmt.Errorf("empty file")
	}
	tx2, dbErr2 := conn.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr2, packages, name)
		return dbErr2
	}
	defer h.FinishTransaktion(tx2, packages,name)
	addOnConflict(tx2)
	err = tx2.Create(&employees).Error
	return err
}

//getAnetIdsMapAnetIdToCard return stings contains anetIds and map from anetIds to numberCards
func getAnetIdsMapAnetIdToCard(array [][]string) (string, map[string]string) {
	anetIdArray := make([]string, 0, len(array))
	myMap := make(map[string]string)
	for i := 0; i < len(array); i++ {
		row := array[i]
		anet := strings.TrimSpace(row[config.AnetIdCard-1])
		if anet == "" {
			continue
		}
		anetIdArray = append(anetIdArray, anet)
		myMap[anet] = strings.TrimSpace(row[config.NumberCard-1])
	}
	return fmt.Sprint("anet_id in ('",
		strings.Join(anetIdArray, "', '"), "')"), myMap
}

//doUpages set cards all employees according mapAnetToCards
func doUpages(employees []employee.BasicEmployee, mapAnetToCards map[string]string) {
	for i := 0; i < len(employees); i++ {
		val, ok := mapAnetToCards[employees[i].AnetId]
		if !ok {
			continue
		}
		employees[i].Card = val
	}
}
