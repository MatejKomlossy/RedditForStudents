package connection_database

import (
	h "backend/helper"
	"backend/paths"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	// concurent map to manage auth
    allow *h.Maps
	warnings *h.Maps
	refuse *h.Maps
// db global variable of connection to database
	db *gorm.DB
	// myRouter local variable of prepared *mux.Router
	myRouter *gin.Engine
	// homePageStringsMethod local variable of prepared field to home page
	homePageStringsMethod = make([]h.MyStrings, 0, 20)
	// startPart, endPart parts of home page
	startPart, endPart, config string
)

const (
	packages = "connection_database"
	dir      = paths.GlobalDir + packages + paths.Scripts
	buildFrontEndDir = paths.GlobalDir + "build_front_end/"
	staticDir =  buildFrontEndDir +"static/"
	imagesDir =  buildFrontEndDir + "images/"
	index =  buildFrontEndDir + "index.html"

)

// InitVars init of variable myRouter, Db, startPart, endPart , WARNING: in can panic when do not found dir+"postgres_config.txt" or dir+"begin_homepage.html" or dir+"end_homepage.html"
func InitVars() {
	gin.SetMode("release")
	myRouter = gin.New()
	myRouter.Use(gin.Recovery())
	dbConfig := h.ReturnTrimFile(dir + "postgres_config.txt")
	startPart = h.ReturnTrimFile(dir + "begin_homepage.html")
	endPart = h.ReturnTrimFile(dir + "end_homepage.html")
	config = dbConfig
	err := createDbConnection()
	if err != nil {
		panic("unconnected: " + err.Error())
	}
	AddHeaderPost(paths.Control, controlPage)
	AddHeaderGet(paths.Logout, logout)
	allow = h.NewMaps(10,89)
	refuse = h.NewMaps(2, 3)
	warnings = h.NewMaps(5, 7)
}

func createDbConnection() error {
	con, err := gorm.Open(postgres.Open(config), &gorm.Config{})
	if err != nil {
		return err
	}
	sqlDB, _ := con.DB()
	sqlDB.SetMaxIdleConns(-1)
	sqlDB.SetMaxOpenConns(-1)
	db = con
	db.Set("gorm:table_options", "DEFAULT CHARSET=utf8")
	return nil
}