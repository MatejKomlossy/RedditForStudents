package helper

import (
	"fmt"
	"strings"
)

// Filter help stuct to filter doc by location
type Filter struct {
	P map[string]string
}

// BuildQuery replace "Query1" and "Query2" from input by type, branches, cities, departments and division which are
//value for search document from database
func (f *Filter) BuildQuery(filterDoc string) string {
	result := filterDoc
	result = strings.ReplaceAll(result, "Query1", f.buildQueryType())
	result = strings.ReplaceAll(result, "Query2", f.BuildQueryAssigned())
	return result
}

func (f *Filter) buildQueryType() string {
	type0, ok := f.P["type"]
	if !ok {
		return ""
	}
	if len(type0) == 0 {
		return ""
	}
	t := strings.Split(type0, ",")
	if len(t) == 1 {
		return fmt.Sprint(" and type=", t[0], " ")
	}
	return fmt.Sprint(" and type in ('", strings.Join(t, "|"),
		"') ")
}

func (f *Filter) BuildQueryAssigned() string {
	if f.assignedEmpty() {
		return ""
	}
	return fmt.Sprint(" and assigned_to SIMILAR TO '%",
		"(", f.structure("branch"), "|x); ",
		"(", f.structure("city"), "|x); ",
		"(", f.structure("department"), "|x); ",
		"(", f.structure("division"), "|x)%'")
}

func (f *Filter) assignedEmpty() bool {
	return len(f.P) == 0
}

func (f *Filter) structure(s string) string {
	s, ok := f.P[s]
	if ok {
		return ArrayInStringToRegularExpression(s)
	}
	return allThingsRegex
}

