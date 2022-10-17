package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync/atomic"
	"time"
)

func tryAlineServer() (uint64, time.Duration) {
	time.Sleep(halfSecond)
	time0 := time.Now()
	i, j := uint64(0), uint64(0)
	Location := strings.TrimSpace(url0)

	for {
		for {
			if i > limitAcceptFallServerInTime {
				return j, time.Now().Sub(time0)
			}

			client := http.Client{Timeout: halfSecond}
			req, err := http.NewRequest("POST", Location, nil)
			if err != nil {
				writeMassageAsError(err.Error())
				break
			}
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			conn, err := client.Do(req)
			if err != nil {
				writeMassageAsError(err.Error())
				break
			}
			var massage Accept
			err = json.NewDecoder(bufio.NewReader(conn.Body)).Decode(&massage)
			if massage.Id != agreementIdServerClient || massage.Message != agreementMessageAccept {
				break
			}
			time.Sleep(halfSecond)
			j++
			if j%1200 == 0 {
				go fmt.Println(time.Now().Format(time.RFC3339), "   tik of ", j, " turn")
			}
		}
		atomic.AddUint64(&i, 1)
		go func() {
			time.Sleep(t)
			atomic.AddUint64(&i, ^uint64(0))
		}()
	}
}
