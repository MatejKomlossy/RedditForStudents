package main

import "time"

//Accept local struct for acceptation massage
type Accept struct {
	Message string `json:"message"`
	Id      uint64 `json:"id"`
}

const (
	t                           = 10 * time.Second
	limitAcceptFallServerInTime = 7
	agreementIdServerClient     = 7777
	agreementMessageAccept      = "accept"
	halfSecond                  = time.Second / 2
	url0                        = "http://5.178.48.91:8180/control7777777"
	errMassage                  = "problem with connection: %v"
)
