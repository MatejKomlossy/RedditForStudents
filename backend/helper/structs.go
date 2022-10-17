package helper

// QueryThreeStrings tuples for three kind query
//- DocumentSignEmployee
//- OnlineSign
//- DocumentSign
type QueryThreeStrings struct {
	DocumentSignEmployee,
	OnlineSign,
	DocumentSign string
}

// MyStrings tuple of two names and SQL query
type MyStrings struct {
	First, Second, Query string
}

// StringsBool tuples for important data from document
type StringsBool struct {
	AssignedTo      string `gorm:"column:assigned_to"`
	Name            string `gorm:"column:name"`
	Link            string `gorm:"column:link"`
	RequireSuperior bool   `gorm:"column:require_superior"`
}

// NewEmployee tuples for important data of new employee
type NewEmployee struct {
	Id         uint64 `json:"id"`
	SuperiorId uint64 `json:"superior_id"`
	Assigned   string `json:"assigned_to"`
}

// Mail struct for extract mails from Database
//- Mail (map to "mail" in SQL)
type Mail struct {
	Mail string `gorm:"column:mail"`
}

// TwoEmails pair of strings:
//  - EmployeeEmail (map on "e_email" in SQL, JSON)
//  - ManagerEmail (map on "m_email" in SQL, JSON)
type TwoEmails struct {
	EmployeeEmail string `gorm:"column:e_email" json:"e_email"`
	ManagerEmail  string `gorm:"column:m_email" json:"m_email"`
}

//Accept local struct for acceptation massage
type Accept struct {
	Message string `json:"message"`
	Id      uint64 `json:"id"`
}

// NameId pair of
//- Id (map on "id" in SQL)
//- Name (map on "name" in SQL)
type NameId struct {
	Id   uint64 `gorm:"column:id"`
	Name string `gorm:"column:name"`
}

// SignsSkillMatrix pair for read ids in strings "1,2,5,10" from JSON
//- Cancel (map to "cancel" in json)
//- Resign (map to "resign" in json)
type SignsSkillMatrix struct {
	Cancel string `json:"cancel"`
	Resign string `json:"resign"`
}

// PasswordConfig pair of config allowing without password
type PasswordConfig struct {
	KioskPasswordFree    bool `json:"kiosk_password_free"`
	InternetPasswordFree bool `json:"internet_password_free"`
}
