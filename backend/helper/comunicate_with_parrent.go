package helper

import (
	"bufio"
	"context"
	"fmt"
	"net/http"
	"os"
)

// WaitToParentSignalEndShutdownServer
// try in cycle whether myUrl string is lived and if not, stop s *http.Server
func WaitToParentSignalEndShutdownServer(s *http.Server, myUrl string) {
	const name = "waitToParentSignalEndShutdownServer"
	sendSignalToParent(myUrl)
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		text := scanner.Text()
		if text == Finish{
			break
		}
	}
	err := s.Shutdown(context.Background())
	if err != nil {
		WriteMassageAsError(err, packages, name )
	}
}

func sendSignalToParent(url string) {
	fmt.Println(Done+url)
}
