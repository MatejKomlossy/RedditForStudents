package helper

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"strings"
	"time"
)

func createZipRemove(name string)  {
	err, realName := createZip(name)
	if err != nil {
		return
	}
	err = os.Remove(realName)
	if err != nil {
		fmt.Println(err)
	}
}

func createZip(name string) (error, string) {
	archive, err := os.OpenFile(name+getCurrentTime()+".zip",os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err, ""
	}
	defer CloseFileIfExist(archive)
    nameLog := name+typeFile
	file, err := os.OpenFile(nameLog,os.O_RDWR, 0644)
	if err != nil {
		return err, ""
	}
	defer closeOrPrintErr(file)
	zipWriter := zip.NewWriter(archive)
	w2, err := zipWriter.Create(nameLog)
	if err != nil {
		return err, ""
	}
	if _, err = io.Copy(w2, file); err != nil {
		return err, ""
	}
	err = zipWriter.Close()
	return err, nameLog
}

func closeOrPrintErr(f *os.File) {
	err := f.Close()
	if err != nil {
		fmt.Println(err)
	}
}

func getCurrentTime() string {
	reslt := time.Now().Format(time.RFC3339Nano)
	reslt = strings.ReplaceAll(reslt, " ", "-")
	reslt = strings.ReplaceAll(reslt, ":", "..")
	return reslt
}