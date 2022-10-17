package document

import (
	con "backend/connection_database"
	h "backend/helper"
	"backend/paths"
)

var (
	confirm, editedDoc, filterDoc, accordingManager string
)

const (
	packages = "document"
	dir      = paths.GlobalDir + packages + paths.Scripts
)

func init0() {
	confirm = h.ReturnTrimFile(dir + "confirm.sql")
	addSignAfterConfirmDoc = h.ReturnTrimFile(dir + "add_sign_after_confirm_doc.sql")
	editedDoc = h.ReturnTrimFile(dir + "edited_doc.sql")
	filterDoc = h.ReturnTrimFile(dir + "doc_filter.sql")
	accordingManager = h.ReturnTrimFile(dir+"get_according_manager_id.sql")
}

func AddHandleInitVars() {
	init0()
	con.AddHeaderPost(paths.DocumentAdd, createDoc)
	con.AddHeaderPost(paths.DocumentUpdate, updateDoc)
	con.AddHeaderGetID(paths.DocumentConfirm, confirmDoc)
	con.AddHeaderPost(paths.DocumentUpdateConfirm, updateConfirmDoc)
	con.AddHeaderPost(paths.DocumentCreateConfirm, createConfirmDoc)
	con.AddHeaderGet(paths.DocumentActual, aktualDoc)
	con.AddHeaderGet(paths.DocumentEdited, getEditedDoc)
	con.AddHeaderPost(paths.DocumentFilter, getFilterDoc)
	con.AddHeaderGetID(paths.DocumentManager, getManagerDoc)
}
