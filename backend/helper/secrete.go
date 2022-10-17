package helper

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strings"
)

var (
	keyHash = []byte("požehnávam tento projekt")
)

func Hash(myPassword string) string {
	lowCasePassword := strings.ToLower(myPassword)
	howMany := int([]rune(lowCasePassword)[0])%12+7
	repeatPassword := strings.Repeat(lowCasePassword, howMany)
	mac := hmac.New(sha256.New, keyHash)
	mac.Write([]byte(repeatPassword))
	macSum := mac.Sum(nil)
	data64 := base64.StdEncoding.EncodeToString(macSum)
	return fmt.Sprintf("%s", data64)
}