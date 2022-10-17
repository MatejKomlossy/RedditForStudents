package signature

import (
	"backend/document"
	"backend/employee"
	"backend/training"
)

type SignatureAndEmployee struct {
	Employee          employee.Employee `gorm:"embedded" json:"employee"`
	Document          document.Document `gorm:"embedded" json:"document"`
	DocumentSignature DocumentSignature `gorm:"embedded" json:"signature"`
}

type ModifyDocumentsAdditionEmployees struct {
	Documents []ModifyDocument    `json:"documents"`
	Employees []employee.Employee `json:"employees"`
}

type OnlineTrainingAndSignature struct {
	OnlineTraining          training.OnlineTraining `gorm:"embedded" json:"training"`
	OnlineTrainingSignature OnlineTrainingSignature `gorm:"embedded" json:"signature"`
}

type SignatureAndDocument struct {
	Document          document.Document `gorm:"embedded" json:"document"`
	DocumentSignature DocumentSignature `gorm:"embedded" json:"signature"`
}

type Signatures struct {
	DocumentSignature []SignatureAndDocument
	EmployeeSignature []SignatureAndEmployee
	OnlineSignature   []OnlineTrainingAndSignature
}

type OnlineTrainingAndSignatureEmployee struct {
	OnlineTraining          training.OnlineTraining `gorm:"embedded" json:"training"`
	OnlineTrainingSignature OnlineTrainingSignature `gorm:"embedded" json:"signature"`
	Employee                employee.Employee       `gorm:"embedded" json:"employee"`
}

type Reports struct {
	EmployeeSignature []SignatureAndEmployee
	OnlineSignature   []OnlineTrainingAndSignatureEmployee
}
