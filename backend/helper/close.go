package helper

import (
	"mime/multipart"
	"os"
)

// CloseFileIfExist close open file
func CloseFileIfExist(f *os.File) {
	const name ="CloseFileIfExist"
	if f != nil {
		err := f.Close()
		if err != nil {
			WriteMassageAsError(err, packages, name)
		}
	}
}

func CloseMultiPathFileIfExist(file multipart.File) {
	const name ="CloseMultiPathFileIfExist"
	if file != nil {
		err := file.Close()
		if err != nil {
			WriteMassageAsError(err, packages, name)
		}
	}
}