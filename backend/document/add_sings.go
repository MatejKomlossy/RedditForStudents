package document

import (
	h "backend/helper"
	"backend/mail"
	"fmt"
	"gorm.io/gorm"
)

var (
	//addSignAfterConfirmDoc to load add_sign_after_confirm_doc.sql, which add signature and return mails
	addSignAfterConfirmDoc string
)

// AddSignature add signature and send mails
func AddSignature(combinations h.StringsBool, DocId uint64, tx *gorm.DB) error {
	var mails []h.TwoEmails
	err := tx.Raw(addSignAfterConfirmDoc,
		combinations.RequireSuperior,
		DocId,
		combinations.AssignedTo,
		combinations.AssignedTo).
		Find(&mails).
		Error
	if err != nil{
		return err
	}
	if len(mails) == 0 {
		return fmt.Errorf("nobody")
	}
	go mail.SendFistMail(mails, combinations)
	return nil
}
