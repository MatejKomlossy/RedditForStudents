package training

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/paths"
)

var (
	editedTraining, filterTraining, lectorAll string
)

const (
	packages = "training"
	dir      = paths.GlobalDir + packages + paths.Scripts
)

func init0() {
	editedTraining = h.ReturnTrimFile(dir + "edited_training.sql")
	filterTraining = h.ReturnTrimFile(dir + "filter_training.sql")
	lectorAll = h.ReturnTrimFile(dir + "lectors_all.sql")
}

func AddHandleInitVars() {
	init0()
	con.AddHeaderGet(paths.EditedTraining, getEditedTrainings)
	con.AddHeaderPost(paths.TrainingSave, createEditedTraining)
	con.AddHeaderPost(paths.TrainingUpdate, updateEditedTraining)
	con.AddHeaderGet(paths.TrainingAll, getActualTraining)
	con.AddHeaderPost(paths.TrainingFilter, getFilterTraining)
	con.AddHeaderGet(paths.LectorsAll, getLectorsAll)
}
