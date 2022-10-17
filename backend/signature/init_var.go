package signature

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/paths"
)

var (
	unsignedSigns, signedSigns h.QueryThreeStrings
	skillMatrixSuperiorId, skillMatrixEmployeeId, skillMatrixDocumentId,
	skillMatrixFilter, cancelSigns, resigns string
	querySign, querySignSuperior, querySignTraining                                 string
	newEmployeesQuery, queryRecursiveVersionDocuments, queryOnlineTrainingEmployees string
)

const (
	packages = "signature"
	dir      = paths.GlobalDir + packages + paths.Scripts
)

func AddHandleInitVars() {
	init0()
	con.AddHeaderGetID(paths.UnsignedSigns, getUnsignedSignatures)
	con.AddHeaderGetID(paths.SignedSigns, getSignedSignatures)
	con.AddHeaderPost(paths.SkillMatrix, getSkillMatrix)
	con.AddHeaderPost(paths.SignDocument, sign)
	con.AddHeaderPost(paths.SignSuperior, signSuperior)
	con.AddHeaderPost(paths.SignTraining, signTraining)
	con.AddHeaderPost(paths.TrainingUpdateConfirm, updateConfirm)
	con.AddHeaderPost(paths.Cancels, cancel)
	con.AddHeaderPost(paths.Resigns, resign)
	con.AddHeaderGetID(paths.TrainingConfirm, confirm)
	con.AddHeaderPost(paths.TrainingSaveConfirm, createConfirm)
	con.AddHeaderGetID(paths.TrainingReport, getTrainingReport)
	con.AddHeaderGetID(paths.DocumentReport, getDocumentReport)
}

func init0() {
	var queryDocumentSign, queryOnlineSign, queryDocumentSignEmployee string
	queryDocumentSign = h.ReturnTrimFile(dir + "unsigned_document_sign.sql")
	queryOnlineSign = h.ReturnTrimFile(dir + "unsigned_online_sign.sql")
	queryDocumentSignEmployee = h.ReturnTrimFile(dir + "unsigned_document_sign_employee.sql")
	unsignedSigns = h.QueryThreeStrings{
		DocumentSignEmployee: queryDocumentSignEmployee,
		OnlineSign:           queryOnlineSign,
		DocumentSign:         queryDocumentSign,
	}

	queryDocumentSign = h.ReturnTrimFile(dir + "signed_document_sign.sql")
	queryOnlineSign = h.ReturnTrimFile(dir + "signed_online_sign.sql")
	queryDocumentSignEmployee = h.ReturnTrimFile(dir + "signed_document_sign_employee.sql")
	signedSigns = h.QueryThreeStrings{
		DocumentSignEmployee: queryDocumentSignEmployee,
		OnlineSign:           queryOnlineSign,
		DocumentSign:         queryDocumentSign,
	}

	skillMatrixSuperiorId = h.ReturnTrimFile(dir + "all_signature_document_by_superior_id.sql")
	skillMatrixDocumentId = h.ReturnTrimFile(dir + "all_signature_document_by_doc_id.sql")
	skillMatrixEmployeeId = h.ReturnTrimFile(dir + "all_signature_document_by_employee_id.sql")
	skillMatrixFilter = h.ReturnTrimFile(dir + "all_signature_document_by_filter.sql")
	querySign = h.ReturnTrimFile(dir + "sign.sql")
	querySignSuperior = h.ReturnTrimFile(dir + "sign_superior.sql")
	querySignTraining = h.ReturnTrimFile(dir + "sign_training.sql")
	cancelSigns = h.ReturnTrimFile(dir + "cancel_signs_on_off.sql")
	resigns = h.ReturnTrimFile(dir + "resign.sql")
	newEmployeesQuery = h.ReturnTrimFile(dir + "new_employees_set_signatures.sql")
	queryOnlineTrainingEmployees = h.ReturnTrimFile(dir + "online_training_employees.sql")
	queryRecursiveVersionDocuments = h.ReturnTrimFile(dir + "recursive_version_documents.sql")
}
