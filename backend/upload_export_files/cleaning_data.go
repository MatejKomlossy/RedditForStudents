package upload_export_files

import (
	"fmt"
	"strings"
)

//filterEmptyName ignore rows with empty column for first name
func filterEmptyName(array [][]string) ([][]string, error) {
	result := make([][]string, 0, len(array))
	var er error
	for i := 0; i < len(array); i++ {
		if which, ok := isSomeImportantEmpty(array[i], i); ok{
			if er == nil {
				er = fmt.Errorf(which)
			}else {
				er = fmt.Errorf("%v and %v", er, which)
			}
			continue
		}
		result = append(result, array[i])
	}
	return result, er
}

func isSomeImportantEmpty(row []string, rowNunber int) (string, bool) {
	var stringBuilderErr strings.Builder
	for i := 0; i < len(config.Important); i++ {
		column := config.Important[i]
		if len(row[column])==0 {
			stringBuilderErr.WriteString(fmt.Sprint("row: ",
				rowNunber, "and column: ", i, "is empty - it was ignored; "))
		}
	}
	if stringBuilderErr.Len() == 0 {
		return "", false
	}
	return strings.Trim(stringBuilderErr.String(), ";"), true
}

//setGeneralIdFromStringIfExist if string s is in dataMap run function f
func setGeneralIdFromStringIfExist(dataMap *map[string]uint64, f func(id uint64), s string) bool {
	id, ok := (*dataMap)[s]
	if ok {
		f(id)
	}
	return ok
}

//getArrayOfKeys get strings array of keys
func getArrayOfKeys(mapId map[string]uint64) []string {
	array := make([]string, 0, len(mapId))
	for key := range mapId {
		array = append(array, key)
	}
	return array
}
