package main

import (
	"fmt"
	"time"
)

func main() {
	for {
		j, ti := tryAlineServer()
		massege := fmt.Sprint(time.Now().Format(time.RFC3339), "  after ", j, " turns and after", ti.String(), " it cash")
		writeMassageAsError(massege)
		fmt.Println(massege)
		ti = tryInactive()
		massege = fmt.Sprint(time.Now().Format(time.RFC3339), "  after", ti.String(), " it wake up")
		writeMassageAsError(massege)
		fmt.Println(massege)
	}
}
