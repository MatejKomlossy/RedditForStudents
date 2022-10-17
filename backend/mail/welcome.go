package mail

import (
	h "backend/helper"
	"fmt"
)

// SendWelcome send to mails in strings massage: "welcome to our company you0 wipublicll need our website:"
func SendWelcome(mails []string) {
	if mails == nil || len(mails) == 0 {
		h.WriteMassageAsError(fmt.Errorf("empty new employees mail"), packages, "SendWelcome")
		return
	}
	ee := emailNameLinkMessage{
		emails:  mails,
		name:    "",
		link:    "",
		massage: configuration.MassageWelcome,
	}
	sendEmail(ee)
}
