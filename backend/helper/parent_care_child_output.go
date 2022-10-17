package helper

import (
	"fmt"
	"os"
	"sync"
	"time"
)

var m sync.Mutex
func writeAllOutputToLogInC(str string) {
	m.Lock()
	file, err := os.OpenFile("C:/interna-dokumentacia-backend/backend/d.txt",os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		_ = file.Close()
	}()
	data := fmt.Sprintln(time.Now().Format(time.RFC3339), " ",str)
	_, _ = file.Write([]byte(data))
	m.Unlock()
}
