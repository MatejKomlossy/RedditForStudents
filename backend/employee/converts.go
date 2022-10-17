package employee

import (
	h "backend/helper"
	"fmt"
)

// ConvertToNewEmployees extract from employees only informations, which are needed to signature
//  - make []h.NewEmployee from []Employee
func ConvertToNewEmployees(employees []*Employee) []h.NewEmployee {
	result := make([]h.NewEmployee, 0, len(employees))
	for i := 0; i < len(employees); i++ {
		result = append(result, employees[i].ConvertToNewEmployee())
	}
	return result
}

// ConvertToNewEmployee extract from one employee only informations, which are needed to signature
func (e *Employee) ConvertToNewEmployee() h.NewEmployee {
	return h.NewEmployee{
		Id:         e.Id,
		SuperiorId: e.ManagerId,
		Assigned: fmt.Sprint("%",
			"(", h.ArrayInStringToRegularExpression(fmt.Sprint(e.BranchId)), "|x); ",
			"(", h.ArrayInStringToRegularExpression(fmt.Sprint(e.CityId)), "|x); ",
			"(", h.ArrayInStringToRegularExpression(fmt.Sprint(e.DepartmentId)), "|x); ",
			"(", h.ArrayInStringToRegularExpression(fmt.Sprint(e.DivisionId)), "|x)%"),
	}
}
