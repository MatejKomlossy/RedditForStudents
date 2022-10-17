package mail

import (
	con "backend/connection_database"
	h "backend/helper"
	"crypto/tls"
	"fmt"
	"gopkg.in/gomail.v2"
	"strings"
)

func sendEmails() {
	sendSuperior()
	sendEmployee()
	sendOnline()
}

func sendEmployee() {
	sendByQuery(queryUnsignDocumentEmployeeEmails,
		configuration.MessageDocOldEmployees)
}

func sendOnline() {
	sendByQuery(queryUnsignTrainingEmployeesEmails,
		configuration.MessageTraining)
}

func sendByQuery(query, massage string) {
	var emails []normSignEmail
	const name = "sendByQuery"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	dbErr = tx.Raw(query).Find(&emails).Error
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return
	}
	for i := 0; i < len(emails); i++ {
		if emails[i].Email == "" || emails[i].Email == " " {
			continue
		}
		email := emailNameLinkMessage{
			[]string{emails[i].Email},
			emails[i].Name,
			emails[i].Link,
			massage,
		}
		sendEmail(email)
	}
}

type emailNameLinkMessage struct {
	emails  []string
	name    string
	link    string
	massage string
}

func sendEmail(ee emailNameLinkMessage) {
	if len(ee.emails) == 0 || debug {
		return
	}
	m := gomail.NewMessage()
	addresses := make([]string, 0, len(ee.emails))
	for i := 0; i < len(ee.emails); i++ {
		addresses = append(addresses, ee.emails[i])
	}
	m.SetAddressHeader("From", configuration.From, "GEFCO Documentation")
	m.SetHeader("To", addresses...)
	msg := strings.ReplaceAll(ee.massage, symbol,
		fmt.Sprint(" ", ee.name, "-", ee.link))
	m.SetHeader("Subject", "mail")
	m.SetBody("text/plain", msg)

	d := gomail.NewDialer(configuration.SmtpHost, configuration.SmtpPort,
		configuration.From, configuration.Password)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	err := d.DialAndSend(m)
	if err != nil {
		h.WriteMassageAsError(err, packages, "sendEmail")
	}
}

func SendFistMail(mails []h.TwoEmails, combinations h.StringsBool) {
	emploE, manageE := getTupleEmails(mails)
	ee := emailNameLinkMessage{
		emails:  emploE,
		name:    combinations.Name,
		link:    combinations.Link,
		massage: configuration.MessageNewDocEmployees,
	}
	sendEmail(ee)
	if combinations.RequireSuperior {
		ee = emailNameLinkMessage{
			emails:  manageE,
			name:    combinations.Name,
			link:    combinations.Link,
			massage: configuration.MessageNewDocManager,
		}
		sendEmail(ee)
	}
}

func getTupleEmails(mails []h.TwoEmails) ([]string, []string) {
	EmployeeEmail := make([]string, 0, len(mails))
	ManagerEmail := make([]string, 0, len(mails))
	for i := 0; i < len(mails); i++ {
		EmployeeEmail = append(EmployeeEmail, mails[i].EmployeeEmail)
		ManagerEmail = append(ManagerEmail, mails[i].ManagerEmail)
	}
	return EmployeeEmail, ManagerEmail
}
func sendSuperior() {
	var emails []superiorSignEmail
	const name = "sendSuperior"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	tx.Raw(queryUnsignDocumentSuperiorEmails).Find(&emails)
	for i := 0; i < len(emails); i++ {
		if emails[i].Email == "" || emails[i].Email == " " {
			continue
		}
		email := emailNameLinkMessage{
			[]string{emails[i].Email},
			emails[i].Name,
			emails[i].Link,
			configuration.MessageOldDocManager,
		}
		sendEmail(email)
	}
}
