package main

import (
	"crypto/tls"
	"fmt"
	"gopkg.in/gomail.v2"
)

func main() {
	m := gomail.NewMessage()
	m.SetHeader("From", "some@***.some")
	m.SetHeader("To", "some@***.some")
	m.SetHeader("Subject", "noreply")
	m.SetBody("text/html", " <b>ide to!</b>")

	d := gomail.NewDialer("smtp.some_server", 587, "some@***.some", "***")
	d.TLSConfig = &tls.Config{}
	fmt.Println(d.TLSConfig)
	
	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}
	fmt.Println("ok!")
}