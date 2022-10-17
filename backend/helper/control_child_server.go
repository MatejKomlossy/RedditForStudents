package helper

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"sync/atomic"
	"time"
)

func tryAlineServerIfNeedSendStop(in io.WriteCloser, cmd *exec.Cmd) {
	const halfSecond = time.Second/2
	time.Sleep(halfSecond)
	i := uint64(0)
	first:for  {
		if i >= limitAcceptFallServerInTime {
			break first
		}
		second:for {
			select {
			case <-chFinish:
				return
			default:
			}
			client := http.Client{Timeout: halfSecond}
			req, err := http.NewRequest("POST", url, nil)
			if err != nil {
				break second
			}
			req.Header.Set("Content-Type",
				"application/x-www-form-urlencoded")
			conn, err := client.Do(req)
			if err != nil {
				break second
			}
			var massage Accept
			err = json.NewDecoder(bufio.NewReader(conn.Body)).Decode(&massage)
			if massage.Id != AgreementIdServerClient || massage.Message != AgreementMessageAccept {
				break second
			}
			time.Sleep(halfSecond)
		}
		atomic.AddUint64(&i, 1)
		go func() {
			time.Sleep(t)
			atomic.AddUint64(&i, ^uint64(0))
		}()
		_, err := in.Write([]byte(fmt.Sprintln(Finish)))
		if err != nil {
			break first
		}
	}
	err := cmd.Process.Kill()
	if err != nil {
		WriteMassageAsError(err,packages, "tryAlineServerIfNeedSendStop")
		_, _ = fmt.Fprintf(os.Stderr, "unpredictible error: %v", err.Error())
	}
}
