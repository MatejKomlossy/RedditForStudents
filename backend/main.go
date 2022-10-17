package main

import (
	"backend/combination"
	 "backend/connection_database"
	"backend/document"
	"backend/employee"
	"backend/helper"
	"backend/languages"
	"backend/mail"
	"backend/signature"
	"backend/tiker"
	"backend/training"
	 "backend/upload_export_files"
	"fmt"
	"os"
	"time"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("error at: ", r)
			helper.WriteMassageAsError(r, "-", "main")
			time.Sleep(time.Minute)
			os.Exit(2)
		}
	}()
	helper.ForkOrContinue()
	connection_database.InitVars()
	combination.AddHandleInitVars()
	employee.AddHandleInitVars()
	document.AddHandleInitVars()
	signature.AddHandleInitVars()
	upload_export_files.AddHandleInitVars()
	training.AddHandleInitVars()
	mail.InitVars()
	mail.InitMailSenders()
	languages.AddHandleInitVars()
	tiker.StartAll()
	connection_database.Start()
}