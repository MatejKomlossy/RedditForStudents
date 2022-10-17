package signature

import (
	"backend/document"
	"backend/employee"
	"backend/training"
)

type ModifyDocument struct {
	document.Document
	Sign []ModifySignDocument ` json:"signatures"`
}

type ModifySignDocument struct {
	DocumentSignature
	Employee *employee.Employee ` json:"employee"`
}

type ModifyTraining struct {
	training.OnlineTraining
	Sign []OnlineTrainingSignature ` json:"signatures"`
}

type ModifyOnlineTrainingSignature struct {
	OnlineTrainingSignature
	Employee *employee.Employee ` json:"employee"`
}

type ModifyTrainingEmployees struct {
	training.OnlineTraining
	Sign []ModifyOnlineTrainingSignature ` json:"signatures"`
}

type ModifySignatures struct {
	DocumentSignature []ModifyDocument `json:"documents"`
	OnlineSignature   []ModifyTraining `json:"trainings"`
}

type ModifyReports struct {
	DocumentSignature []ModifyDocument          `json:"documents"`
	OnlineSignature   []ModifyTrainingEmployees `json:"trainings"`
}

func SignatureToModify(signature DocumentSignature) *ModifySignDocument {
	return &ModifySignDocument{
		DocumentSignature: signature, Employee: nil,
	}
}

func convertDocumentToModify(d document.Document) *ModifyDocument {
	return &ModifyDocument{
		Document: d,
		Sign:     make([]ModifySignDocument, 0, 200),
	}
}
func convertTrainingToModify(onlineTraining training.OnlineTraining) *ModifyTraining {
	return &ModifyTraining{
		OnlineTraining: onlineTraining,
		Sign:           make([]OnlineTrainingSignature, 0, 200),
	}
}

func convertReportTrainingToModify(onlineTraining training.OnlineTraining) *ModifyTrainingEmployees {
	return &ModifyTrainingEmployees{
		OnlineTraining: onlineTraining,
		Sign:           make([]ModifyOnlineTrainingSignature, 0, 200),
	}
}
