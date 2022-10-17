package employee

import (
	con "backend/connection_database"
	h "backend/helper"
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"
)

const (
	Card           = "card"
	PasswordColumn = "password"
	Login          = "login"
)


// DataWR pair:
//- S *MyStrings
//- RW *RquestWriter
type DataWR struct {
	S  *h.MyStrings
	Ctx *gin.Context
}

// BuildQuery build command to SQL find employee by name and password
//(password can be skip according Config *PasswordConfig)
// and command save to "self.S.Query"
func (rw *DataWR) BuildQuery(Config *h.PasswordConfig) (error, string) {
	b := Config.KioskPasswordFree
	if rw.S.First == Login {
		b = Config.InternetPasswordFree
	}
	name, passwdE := rw.getNamePassword()
	fmt.Println(name," ", passwdE)
	if ok := con.IsRefused(name); ok {
		return fmt.Errorf("refuse name "), ""
	}
	if name == "" {
		return fmt.Errorf("empty name"), ""
	}
	var query strings.Builder
	query.WriteString(fmt.Sprint( rw.S.First, "='", name, "'"))
	if !b {
		query.WriteString(fmt.Sprint(" and ", rw.S.Second, "='", passwdE, "'::varchar"))
	}
	query.WriteString(" and (deleted is null or deleted = false)")
	rw.S.Query = query.String()
	return nil, name
}

// getNamePassword select name and password from request in rw
func (rw *DataWR) getNamePassword() (string, string) {
	name := rw.Ctx.Request.FormValue(rw.S.First)
	passwdE := h.Hash(strings.ToLower(rw.Ctx.Request.FormValue(rw.S.Second)))
	// TODO client side hash
	return strings.ToLower(name), passwdE
}

