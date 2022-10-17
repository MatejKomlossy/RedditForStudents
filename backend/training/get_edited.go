package training

import (
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func getEditedTrainings(ctx *gin.Context) {
	const name ="getEditedTrainings"
	err := sendTrainingByQuery(ctx, editedTraining)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
	}
}
