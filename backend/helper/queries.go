package helper

import (
	"fmt"
	"strings"
)

func ReplaceIfNotNilAddAndIfIsAncestor(condition, query string) func(field interface{}, label string) string {
	return func(field interface{}, label string) (newQuery string) {
		condition = " and " + condition
		if (field != interface{}(nil)) && (field != nil) {
			fieldString := fmt.Sprint(field)
			if fieldString == "" || fieldString == "undefined" {
				newQuery = strings.Replace(query, label, "", 1)
				return
			}
			newQuery = strings.Replace(query, label, fmt.Sprintf(condition, fieldString), 1)
		} else {
			newQuery = strings.Replace(query, label, "", 1)
		}
		return
	}
}
