package mail

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
)

func sendNotifications() {
	const name = "sendNotifications"
	tx, dbErr := con.GetDatabaseConnection()
	if dbErr != nil {
		h.WriteMassageAsError(dbErr, packages, name)
		return
	}
	defer h.FinishTransaktion(tx, packages,name)
	var emails NameLinkDocuments
	err := tx.Raw(oldDoc).Find(&emails).Error
	if emails == nil || len(emails) == 0 || err != nil {
		h.WriteMassageAsError(fmt.Errorf("zero emails, %v", err), packages, "sendNotifications")
		return
	}
	email := emailNameLinkMessage{
		adminMails.Emails,
		"",
		"",
		emails.getMessage(),
	}
	sendEmail(email)
}
