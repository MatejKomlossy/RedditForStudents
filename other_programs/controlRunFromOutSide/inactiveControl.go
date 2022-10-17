package main

import (
	"bufio"
	"encoding/json"
	"net/http"
	"time"
)

func tryInactive() time.Duration {
	time.Sleep(halfSecond)
	time0 := time.Now()
	for {
		time.Sleep(halfSecond)
		client := http.Client{Timeout: halfSecond}
		req, err := http.NewRequest("POST", url0, nil)
		if err != nil {
			continue
		}
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		conn, err := client.Do(req)
		if err != nil {
			continue
		}
		var massage Accept
		err = json.NewDecoder(bufio.NewReader(conn.Body)).Decode(&massage)
		if massage.Id == agreementIdServerClient && massage.Message == agreementMessageAccept {
			return time.Now().Sub(time0)
		}
	}
}
