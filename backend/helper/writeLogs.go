package helper

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)


// WriteMassageAsError async write to gefko.log.zip
func WriteMassageAsError(massange interface{}, packages, function string) {
	go writeMassageAsError(massange, packages, function)
}

func writeMassageAsError(massange interface{}, packages, function string) {
	muxErr.Lock()
	defer func() {
		muxErr.Unlock()
	}()
	file, err := os.OpenFile(gefkoLog+typeFile,os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		fmt.Printf(errMassage, packages, function, err)
		return
	}
	defer func() {
		_ = file.Close()
	}()
	data := fmt.Sprintln(" ", time.Now().Format(time.RFC3339), ", ",
		fmt.Sprintf(errMassage, packages, function, massange), ";;;  ")
	_, err = file.Write([]byte(data))
	if err != nil {
		log.Fatalf(errMassage, packages, function, err)
	}
	if IsParent {
		return
	}
	stat := fileSyncGetInfoClose(file)
	controlSizeAndIfBigZipping(gefkoLog, stat)
}

func Log(r *http.Request)  {
	logMassage := fmt.Sprintln(" Method: ", r.Method, " Path: ",
		r.URL.Path," RemoteAddress: ", r.RemoteAddr,
		" UserAgent: ", r.UserAgent()," Time: ", time.Now().Format(time.RFC3339))
	go writeUrlPath(logMassage)

}
func writeUrlPath( logMassage string) {
	const name = "writeUrlPath"
	muxLogs.Lock()
	defer muxLogs.Unlock()
	file, err := os.OpenFile(historyLog+typeFile, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		WriteMassageAsError(err,packages,name)
		fmt.Println(err)
		return
	}
	defer func() {
		_ = file.Close()
	}()
	_, err = file.Write([]byte(logMassage))
	if err != nil {
		WriteMassageAsError(err,packages,name)
	}
	stat := fileSyncGetInfoClose(file)
	controlSizeAndIfBigZipping(historyLog, stat)
}

func controlSizeAndIfBigZipping(nameLog string, stat os.FileInfo) {
	if stat == nil {
		fmt.Println("no stat")
		return
	}
	size := stat.Size()
	if size > int64(GB2/4){
		createZipRemove(nameLog)
	}
}

func fileSyncGetInfoClose(file *os.File) os.FileInfo {
	const errorAt =  "error at write to "
	err := file.Sync()
	if err != nil {
		_, _ = fmt.Fprint(os.Stderr,errorAt+gefkoLog)
	}
	stat, err := file.Stat()
	if err != nil {
		_, _ = fmt.Fprint(os.Stderr, errorAt+gefkoLog)
	}
	err = file.Close()
	if err != nil {
		_, _ = fmt.Fprint(os.Stderr, errorAt+gefkoLog)
	}
	return stat
}