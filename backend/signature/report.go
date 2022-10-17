package signature

import (
	"sort"
)

func (report *Reports) convertToModifyReport() *ModifyReports {
	containsMapDoc := make(map[uint64]*ModifyDocument, len(report.EmployeeSignature))
	report.convertToModifySignatureDoc(containsMapDoc)
	containsMapOnline := make(map[uint64]*ModifyTrainingEmployees, len(report.OnlineSignature))
	report.convertToModifyReportSignatureOnline(containsMapOnline)
	return report.signFlushMapsToSlices(containsMapDoc, containsMapOnline)
}
func (report *Reports) convertToModifySignatureDoc(containsMap map[uint64]*ModifyDocument) {
	for i := 0; i < len(report.EmployeeSignature); i++ {
		documentSignature := &report.EmployeeSignature[i]
		convertReportsOneSignitureEmployee(containsMap, documentSignature)
	}
}

func convertReportsOneSignitureEmployee(containsMap map[uint64]*ModifyDocument, signature *SignatureAndEmployee) {
	MDocument, ok := containsMap[signature.Document.Id]
	if !ok {
		MDocument = convertDocumentToModify(signature.Document)
		containsMap[signature.Document.Id] = MDocument
	}
	careReportsSignEmployee(MDocument, signature)
}

func careReportsSignEmployee(modifyDocument *ModifyDocument, signature *SignatureAndEmployee) {
	signatureModify := SignatureToModify(signature.DocumentSignature)
	signatureModify.Employee = &signature.Employee
	modifyDocument.Sign = append(modifyDocument.Sign, *signatureModify)
}

func (report *Reports) convertToModifyReportSignatureOnline(online map[uint64]*ModifyTrainingEmployees) {
	for i := 0; i < len(report.OnlineSignature); i++ {
		documentSignature := report.OnlineSignature[i]
		convertOneReportSignitureOnline(online, documentSignature)
	}
}

func convertOneReportSignitureOnline(online map[uint64]*ModifyTrainingEmployees, report OnlineTrainingAndSignatureEmployee) {
	modifyTraining, ok := online[report.OnlineTraining.Id]
	if !ok {
		modifyTraining = convertReportTrainingToModify(report.OnlineTraining)
		online[report.OnlineTraining.Id] = modifyTraining
	}
	modifyTraining.Sign = append(modifyTraining.Sign, convertReportTraining(report))
}

func convertReportTraining(report OnlineTrainingAndSignatureEmployee) ModifyOnlineTrainingSignature {
	return ModifyOnlineTrainingSignature{
		OnlineTrainingSignature: report.OnlineTrainingSignature,
		Employee:                &report.Employee,
	}
}

func (report *Reports) signFlushMapsToSlices(doc map[uint64]*ModifyDocument, online map[uint64]*ModifyTrainingEmployees) *ModifyReports {
	result := createEmptyModifyReportsSignaturesWithCapacity(report)
	for _, value := range doc {
		result.DocumentSignature = append(result.DocumentSignature, *value)
	}
	sort.SliceStable(result.DocumentSignature, func(i, j int) bool {
		return result.DocumentSignature[i].Deadline.Time.Before(result.DocumentSignature[j].Deadline.Time)
	})
	for _, value := range online {
		result.OnlineSignature = append(result.OnlineSignature, *value)
	}
	return result
}
func createEmptyModifyReportsSignaturesWithCapacity(s *Reports) *ModifyReports {
	return &ModifyReports{
		DocumentSignature: make([]ModifyDocument, 0, len(s.EmployeeSignature)/2+
			len(s.EmployeeSignature)/2),
		OnlineSignature: make([]ModifyTrainingEmployees, 0, len(s.OnlineSignature)/2),
	}
}
