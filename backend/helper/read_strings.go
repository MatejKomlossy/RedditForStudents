package helper

import (
	"encoding/csv"
	"io/ioutil"
	"os"
	"strings"
)

// ReturnTrimFile read whole file and return trim string, WARNING: if apear error, this func will stop program with panic
func ReturnTrimFile(nameFile string) string {
	dat, err := ioutil.ReadFile(nameFile)
	Check(err, nameFile)
	return strings.TrimSpace(string(dat))
}

// ReadCsvFile read csv return error or data as [][]string
func ReadCsvFile(filePath string) ( [][]string,  error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer CloseFileIfExist(file)
	csvReader := csv.NewReader(file)
	csvReader.Comma = ';'
	fileArrayStrings, err := csvReader.ReadAll()
	if err == nil {
		trimAll(fileArrayStrings)
	}
	return fileArrayStrings, err
}

func trimAll(fileArrayStrings [][]string) {
	if fileArrayStrings == nil ||
		len(fileArrayStrings) == 0 {
		return
	}
	removeBOM(fileArrayStrings)
	for i := 0; i < len(fileArrayStrings); i++ {
		for j := 0; j < len(fileArrayStrings[i]); j++ {
			fileArrayStrings[i][j] = strings.TrimSpace(fileArrayStrings[i][j])
		}
	}
}

func removeBOM(fileArrayStrings [][]string) {
	if len(fileArrayStrings[0]) == 0 ||
		len(fileArrayStrings[0][0]) == 0 {
		return
	}
	fileArrayStrings[0][0] = strings.ReplaceAll(fileArrayStrings[0][0], string(bom), "")
}

