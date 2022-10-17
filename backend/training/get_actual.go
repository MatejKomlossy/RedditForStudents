package training

import (
	h "backend/helper"
	"github.com/gin-gonic/gin"
)

func getActualTraining(ctx *gin.Context) {
	const name ="getActualTraining"
	allActualTraining := h.ReplaceIfNotNilAddAndIfIsAncestor(h.Empty, filterTraining)(h.Empty, "Query1")
	allActualTraining = h.ReplaceIfNotNilAddAndIfIsAncestor(h.Empty, allActualTraining)(h.Empty, "Query2")
	err := sendTrainingByQuery(ctx, allActualTraining)
	if err != nil {
		h.WriteErrWriteHandlers(err, packages, name, ctx)
	}
}
