// Package connection_database manage connection to database and router
package connection_database

import (
	h "backend/helper"
	"backend/paths"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)
//GetDatabaseConnection  return connection to database
func GetDatabaseConnection() (*gorm.DB, error) {
	tx := db.Begin()
	err := tx.Error
	if err != nil {
		db, err = tryNewDatabaseConnection()
		return db, err
	}
	return tx, err
}

func tryNewDatabaseConnection() (*gorm.DB, error) {
	err := createDbConnection()
	if err != nil {
		return nil, err
	}
	tx := db.Begin()
	return tx, tx.Error
}


//Start prepare frontend and homePagebackend sub-sites and start server
func Start() {
	finishBackend()
	registerFrontend()
	startServer()
}

//finishBackend add to sites sub-domen '/homePageBackend', which show all other sub-domen
func finishBackend() {
	inithomePageString()
	myRouter.GET(paths.HomePage, homePage)
}


//registerFrontend add all sub-domen needed for frontend
func registerFrontend() {
	provideFrontend := func(ctx *gin.Context) {
		http.ServeFile(ctx.Writer, ctx.Request, index)
	}
	sep := "/"
	frontendURLs := []string{"", "login", "records-to-sign",
		"signed-records", "add-record", "saved-record", "finder",
		"settings", "logout"}
	for i := 0; i < len(frontendURLs); i++ {
		myRouter.GET(fmt.Sprint(sep, frontendURLs[i]), provideFrontend)
	}
	myRouter.StaticFS("/static/", http.Dir(staticDir))
	myRouter.StaticFile("/logo.png", imagesDir)
}

// startServer served with automatic restart after error with connection
func startServer() {
	portbackend := h.ReturnTrimFile(dir + "port.txt")
	fmt.Println("Listen on " + portbackend)
	myUrl := fmt.Sprint("http://localhost", portbackend, paths.Control)
	for {
		s := NewServer(portbackend)
		go h.WaitToParentSignalEndShutdownServer(s, myUrl)
		err := s.ListenAndServe()
		checkErr(err)
	}
}

func checkErr(err error) {
	if err != nil {
		if err.Error() == "http: Server closed" {
			fmt.Println("reset")
		} else {
			h.WriteMassageAsError(err, packages, "startServer")
		}
	}
}
// NewServer make new server to run from pre-prepared package's variable 'myRouter' on port string
func NewServer(port string) *http.Server {
	cloneRouter := gin.New()
	cloneRouter.Use(gin.Recovery())
	routes := myRouter.Routes()
	for i := 0; i < len(routes); i++ {
		route :=  routes[i]
		cloneRouter.Handle(route.Method,
			route.Path,
			route.HandlerFunc)
	}
	return  &http.Server{
		Addr:         port,
		Handler:      cloneRouter,
	}

}
