package main

import (
	"fmt"
	"log"
	"os"
	"time"
)

func writeMassageAsError(massange string) {
	file, err := os.OpenFile("log.txt", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		fmt.Printf(errMassage, err)
		return
	}
	data := fmt.Sprintln(" ", time.Now().Format(time.RFC3339), ", ",
		fmt.Sprintf(errMassage, massange), ";;;  ")
	_, err = file.Write([]byte(data))
	if err != nil {
		log.Fatalf(errMassage, err)
	}
}
