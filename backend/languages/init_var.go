package languages

import (
	con "backend/connection_database"
	"backend/paths"
	"fmt"
)

const (
	packages = "languages"
	dir      = paths.GlobalDir + packages + paths.Scripts
	languageSymbol = "language"
)

func AddHandleInitVars() {
	con.AddHeaderGet(paths.AllLanguages, listAll)
	con.AddHeaderGet(fmt.Sprint(paths.Language, "/:"+languageSymbol), readOne)
}
