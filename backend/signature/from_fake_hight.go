package signature

import "backend/signature/fake_structs"

func convertOneEmployeeSignFromFake(andEmployee fake_structs.SignatureAndEmployee) SignatureAndEmployee {
	result := SignatureAndEmployee{
		Employee:          convertToNormalEmployee(andEmployee.Employee),
		Document:          convertToNormalDoc(andEmployee.Document),
		DocumentSignature: convertToNormalSignDoc(andEmployee.DocumentSignature),
	}
	return result
}

func convertOneOnlineSignFromFake(signature fake_structs.OnlineTrainingAndSignature) OnlineTrainingAndSignature {
	return OnlineTrainingAndSignature{
		OnlineTraining:          convertToNormalTraining(signature.OnlineTraining),
		OnlineTrainingSignature: convertToNormalSingOnlineTraining(signature.OnlineTrainingSignature),
	}
}

func convertSignatureFromFake(signatures *fake_structs.Signatures) *Signatures {
	result := &Signatures{}
	result.EmployeeSignature = convertEmployeeSignFromFake(signatures.EmployeeSignature)
	result.DocumentSignature = convertDocSignFromFake(signatures.DocumentSignature)
	result.OnlineSignature = convertOnlineSignFromFake(signatures.OnlineSignature)
	return result
}

func convertOnlineSignFromFake(signature []fake_structs.OnlineTrainingAndSignature) []OnlineTrainingAndSignature {
	if signature == nil{
		return make([]OnlineTrainingAndSignature, 0, 0)
	}
	result := make([]OnlineTrainingAndSignature, 0, len(signature))
	for i := 0; i < len(signature); i++ {
		result = append(result, convertOneOnlineSignFromFake(signature[i]))
	}
	return result
}

func convertDocSignFromFake(signature []fake_structs.SignatureAndDocument) []SignatureAndDocument {
	if signature == nil{
		return make([]SignatureAndDocument, 0, 0)
	}
	result := make([]SignatureAndDocument, 0, len(signature))
	for i := 0; i < len(signature); i++ {
		result = append(result, convertOneDocSignFromFake(signature[i]))
	}
	return result
}

func convertEmployeeSignFromFake(signature []fake_structs.SignatureAndEmployee) []SignatureAndEmployee {
	if signature == nil{
		return make([]SignatureAndEmployee, 0, 0)
	}
	result := make([]SignatureAndEmployee, 0, len(signature))
	for i := 0; i < len(signature); i++ {
		result = append(result, convertOneEmployeeSignFromFake(signature[i]))
	}
	return result
}

func convertOneDocSignFromFake(andDocument fake_structs.SignatureAndDocument) SignatureAndDocument {
	return SignatureAndDocument{
		Document:          convertToNormalDoc(andDocument.Document),
		DocumentSignature: convertToNormalSignDoc(andDocument.DocumentSignature),
	}
}

func convertFromFakeReport(report *fake_structs.Reports) *Reports {
	return &Reports{
		EmployeeSignature: convertEmployeeSignFromFake(report.EmployeeSignature),
		OnlineSignature:   convertSignatureReportFromFake(report.OnlineSignature),
	}
}

func convertSignatureReportFromFake(signature []fake_structs.OnlineTrainingAndSignatureEmployee) []OnlineTrainingAndSignatureEmployee {
	if signature == nil{
		return make([]OnlineTrainingAndSignatureEmployee, 0, 0)
	}
	result := make([]OnlineTrainingAndSignatureEmployee, 0, len(signature))
	for i := 0; i < len(signature); i++ {
		result = append(result, convertOneOnlineTrainingAndSignatureEmployee(signature[i]))
	}
	return result
}

func convertOneOnlineTrainingAndSignatureEmployee(onlineTrainingAndSignatureEmployee fake_structs.OnlineTrainingAndSignatureEmployee) OnlineTrainingAndSignatureEmployee {
	return OnlineTrainingAndSignatureEmployee{
		OnlineTraining:          convertToNormalTraining(onlineTrainingAndSignatureEmployee.OnlineTraining),
		OnlineTrainingSignature: convertToNormalSingOnlineTraining(onlineTrainingAndSignatureEmployee.OnlineTrainingSignature),
		Employee:                convertToNormalEmployee(onlineTrainingAndSignatureEmployee.Employee),
	}
}
