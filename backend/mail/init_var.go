package mail

import (
	h "backend/helper"
	"backend/paths"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
	"time"
)

const (
	day      = time.Hour * 24
	debug    = true
	symbol   = "{document}"
	packages = "mail"
	dir      = paths.GlobalDir + packages
)

var (
	configuration *config
	adminMails    *adminEmails
	twoTimes      *TwoTimes
	queryUnsignDocumentSuperiorEmails, queryUnsignDocumentEmployeeEmails,
	queryUnsignTrainingEmployeesEmails, oldDoc string
)

func init0() {
	loadConfig()
	loadQuery()
}

func loadQuery() {
	queryUnsignDocumentSuperiorEmails = h.ReturnTrimFile(fmt.Sprint(dir,
		paths.Scripts, "query_unsign_document_superior_emails.sql"))
	queryUnsignDocumentEmployeeEmails = h.ReturnTrimFile(fmt.Sprint(dir,
		paths.Scripts, "query_unsign_document_employee_emails.sql"))
	oldDoc = h.ReturnTrimFile(fmt.Sprint(dir, paths.Scripts, "old_document.sql"))
	queryUnsignTrainingEmployeesEmails = h.ReturnTrimFile(fmt.Sprint(dir, paths.Scripts, "query_unsign_training_employees_emails.sql"))
}

func loadConfig() {
	loadMailTime()
	loadOtherConfig()
}

func loadOtherConfig() {
	stringConfig := h.ReturnTrimFile(fmt.Sprint(dir,
		paths.Scripts, "emails_of_admins.txt"))
	err := json.Unmarshal([]byte(stringConfig), &adminMails)
	h.Check(err)
	stringConfig = h.ReturnTrimFile(fmt.Sprint(dir, paths.Scripts, "mail_config.txt"))
	err = json.Unmarshal([]byte(stringConfig), &configuration)
	h.Check(err)
	re := reflect.ValueOf(configuration).Elem()
	masanges := []string{"massage_welcome", "message_training",
		"message_new_doc_manager", "message_old_doc_manager",
		"message_new_doc_employees", "message_doc_old_employees"}
	for i := 0; i < len(masanges); i++ {
		stringConfig = h.ReturnTrimFile(fmt.Sprint(dir, "/emails_massage/",
			masanges[i], ".txt"))
		name := getFieldName(masanges[i])
		f := re.FieldByName(name)
		f.SetString(stringConfig)
	}
}

func getFieldName(s string) string {
	tuple := strings.Split(s, "_")
	for i := 0; i < len(tuple); i++ {
		tuple[i] = strings.Title(tuple[i])
	}
	return strings.Join(tuple, "")
}

func loadMailTime() {
	defer func() {
		r := recover()
		if r != nil {
			h.WriteMassageAsError(r, packages, "loadMailTime")
			twoTimes = &TwoTimes{
				DateEmails: time.Now(),
				DateNotify: time.Now(),
			}
		}
	}()
	stringConfig := h.ReturnTrimFile(fmt.Sprint(dir, paths.Scripts, "mail.lock"))
	err := json.Unmarshal([]byte(stringConfig), &twoTimes)
	if err != nil {
		panic(err)
	}
}
