package helper

import (
	"fmt"
	"strconv"
	"strings"
)

// ArrayUint64ToString convert from array to string for SQL
func ArrayUint64ToString(array []uint64, delim string) string {
	return strings.Trim(strings.ReplaceAll(fmt.Sprint(array), " ", delim), "[]")
}

// FromStringToArrayUint64 convert from string to array
func FromStringToArrayUint64(idsString string) []uint64 {
	fieldIdStrings := strings.Split(idsString, ",")
	result := make([]uint64, 0, len(fieldIdStrings))
	for i := 0; i < len(fieldIdStrings); i++ {
		oneIdString := strings.TrimSpace(fieldIdStrings[i])
		id, err := strconv.ParseUint(oneIdString, 10, 64)
		if err != nil {
			WriteMassageAsError(err, packages, "FromStringToArrayUint64")
			continue
		}
		result = append(result, id)
	}
	return result
}


// ArrayInStringToRegularExpression from array in string("4,2,8,10,32") to DB alternative search "[0-9,]*4|2|8|10|32[0-9,]*"
// at empty and "x" string returning "([0-9,]+|x)" for all
func ArrayInStringToRegularExpression(arrayString string) string {
	if arrayString == "x" || len(arrayString) == 0 {
		return allThingsRegex
	}
	array := strings.Split(arrayString, ",")
	if len(array) == 1 {
		return fmt.Sprint("[0-9,]*", array[0], "[0-9,]*")
	}
	return fmt.Sprint("[0-9,]*(", strings.Join(array, "|"), ")[0-9,]*")
}
