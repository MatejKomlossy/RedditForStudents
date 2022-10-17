package mail

import (
	"backend/employee"
	"fmt"
	"strings"
	"time"
)

type config struct {
	From                   string `json:"from"`
	Password               string `json:"password"`
	SmtpHost               string `json:"smtpHost"`
	SmtpPort               int    `json:"smtpPort"`
	MessageDocOldEmployees string `json:"message_doc_old_employees"`
	MessageNewDocEmployees string `json:"message_new_doc_employees"`
	MessageNewDocManager   string `json:"message_new_doc_manager"`
	MessageTraining        string `json:"message_training"`
	MassageWelcome         string `json:"massage_welcome"`
	MessageOldDoc          string `json:"message_old_doc"`
	MessageOldDocManager   string `json:"message_old_doc_manager"`
}

type adminEmails struct {
	Emails []string `json:"emails"`
}

type TwoTimes struct {
	DateEmails time.Time `json:"date_emails"`
	DateNotify time.Time `json:"date_notify"`
}

type superiorSignEmail struct {
	NameLinkDocument
	Email string `gorm:"column:email"`
	employee.BasicEmployee
}

func (e *superiorSignEmail) getFormat() string {
	return fmt.Sprint(" doc: ", e.Name, "link: ", e.Link,
		" who: ", e.AnetId, "-", e.FirstName, "-", e.LastName)
}

type normSignEmail struct {
	NameLinkDocument
	Email string `gorm:"column:email"`
}

type NameLinkDocument struct {
	Name string `gorm:"column:name"`
	Link string `gorm:"column:link"`
}

func (d *NameLinkDocument) format(delitem string) string {
	return fmt.Sprint(" ", d.Name, " - ", d.Link, delitem)
}

type NameLinkDocuments []NameLinkDocument

func (d NameLinkDocuments) getMessage() string {
	var result strings.Builder
	for i := 0; i < len(d)-1; i++ {
		result.WriteString(d[i].format("; "))
	}
	result.WriteString(d[len(d)-1].format(" "))
	return strings.ReplaceAll(configuration.MessageOldDoc,
		symbol, result.String())
}
