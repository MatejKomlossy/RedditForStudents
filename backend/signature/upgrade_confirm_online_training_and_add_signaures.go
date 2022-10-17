package signature

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/training"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"strconv"
	"time"
)

func updateConfirm(ctx *gin.Context) {
	const name = "updateConfirm"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var newTraining training.OnlineTraining
	e := json.NewDecoder(ctx.Request.Body).Decode(&newTraining)
	if e != nil {
		h.WriteErrWriteHandlers(e, packages, name, ctx)
		return
	}
	newTraining.Edited = false
	err := tx.Updates(&newTraining).Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	err = confirmInDb(newTraining, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	carrySignToTraining(newTraining, tx, ctx)
}

func createConfirm(ctx *gin.Context) {
	const name = "createConfirm"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var newTraining training.OnlineTraining
	e := json.NewDecoder(ctx.Request.Body).Decode(&newTraining)
	if e != nil {
		h.WriteErrWriteHandlers(e, packages, name, ctx)
		return
	}
	newTraining.Edited = false
	result := tx.Create(&newTraining)
	if result.Error != nil {
		h.WriteErrWriteHandlers(result.Error, packages, name, ctx)
		return
	}
	err := confirmInDb(newTraining, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	carrySignToTraining(newTraining, tx, ctx)
}

func confirmInDb(newTraining training.OnlineTraining, tx *gorm.DB) error {
	result := tx.Model(&newTraining).Updates(map[string]interface{}{"edited": false})
	return result.Error
}

func carrySignToTraining(newTraining training.OnlineTraining, tx *gorm.DB, writer *gin.Context) {
	err := saveSignToTraining(newTraining, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, "carrySignToTraining", writer)
		return
	}
	tx.Commit()
	con.SendAccept(newTraining.Id, writer)
}

func saveSignToTraining(newTraining training.OnlineTraining, tx *gorm.DB) error {
	signs := createOnlineSigns(newTraining)
	result := tx.Create(&signs)
	return result.Error
}

func confirm(ctx *gin.Context) {
	const name = "confirm"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteErrWriteHandlers(dbErr, packages, name, ctx)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	idString := ctx.Param("id")
	if len(idString) == 0 {
		h.WriteErrWriteHandlers(fmt.Errorf("not found 'id'"), packages, name, ctx)
		return
	}
	id, err := strconv.ParseUint(idString, 10, 64)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	var newTraining training.OnlineTraining
	err = tx.First(&newTraining, id).
		Error
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	err = confirmInDb(newTraining, tx)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
		return
	}
	carrySignToTraining(newTraining, tx, ctx)
}

func createOnlineSigns(training training.OnlineTraining) []OnlineTrainingSignature {
	arrayIdEmployees := h.FromStringToArrayUint64(training.IdEmployees)
	signs := make([]OnlineTrainingSignature, 0, len(arrayIdEmployees))
	for i := 0; i < len(arrayIdEmployees); i++ {
		signs = append(signs, OnlineTrainingSignature{
			EmployeeId: arrayIdEmployees[i],
			TrainingId: training.Id,
			Date: sql.NullTime{
				Time:  time.Now(),
				Valid: false,
			},
		})
	}
	return signs
}