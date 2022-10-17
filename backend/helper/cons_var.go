package helper

import (
	"sync"
	"time"
)

const (
	packages       = "helper"
	allThingsRegex = "([0-9,]+|x)"

	Empty = ""

	Exports = "exports"

	errMassage = "in function %v which is in package %v, was occured this error: %v"

	typeFile = ".log"
	gefkoLog = "gefko"
	historyLog = "gefco_history"

	ParentProcess = 0
	ChildProcess  = 1
	flagChild     = "-children"
	SplitChars = "%%%!:"
	Done = "--done--Load" + SplitChars
	Finish = "--finish" + SplitChars
	GB2 = 10 << 28 //max 2 Gb
	t = 10*time.Second
	limitAcceptFallServerInTime = 7
	AgreementIdServerClient = 7777
	AgreementMessageAccept = "accept"
)

var (
	muxErr, muxLogs = sync.Mutex{}, sync.Mutex{}
	bom = []byte {0xef, 0xbb, 0xbf} // UTF-8
	chFinish = make(chan bool)
	howManySignal  = 0
	url      string
	IsParent = true
)
