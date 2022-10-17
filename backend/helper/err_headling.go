package helper

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// WriteErrWriteHandlers write error to gefko.log and send StatusInternalServerError - code 500
func WriteErrWriteHandlers(e error, packages, function string, ctx *gin.Context) {
	WriteMassageAsError(e, packages, function)
	http.Error(ctx.Writer, e.Error(), http.StatusInternalServerError)
}

// Check if not error nil(null) end whole program with panic
func Check(e error, nameFile string) {
	x := fmt.Sprint("load: ", nameFile)
	if e != nil {
		x = fmt.Sprint("crash: ", nameFile, " ")
		fmt.Println(x)
		panic(e)
	}else{
		fmt.Println(x)
	}
}

func FinishTransaktion(tx *gorm.DB, packageForm, functionFrom string) {
	if tx.Error != nil {
		 err := tx.Rollback().Error
		if err != nil {
			WriteMassageAsError(err, packageForm, functionFrom+" called by FinishTransaktion")
		}
	}
	tx.Commit()
}

func ErrorTogether(err error, err2 error) error {
	if err == nil && err2 == nil {
		return nil
	}
	if err != nil && err2 != nil {
		return fmt.Errorf("%v and %v", err.Error(), err2.Error())
	}
	if err != nil {
		return err
	}
	return err2
}
