package helper

import (
	"bufio"
	"fmt"
	"os/exec"
)

// RunPythonScript
//  - build command
//  - run python script with arguments(first and second)
//  - return result
func RunPythonScript(script string, args ...string) (string, error) {
	cmd := exec.Command("python", script)
	return runCmdWithArguments(cmd, args...)
}

// runCmdWithArguments set args and run cmd
func runCmdWithArguments(cmd *exec.Cmd, args ...string) (string, error) {
	err3 := writePipe(cmd, args...)
	if err3 != nil {
		return "", fmt.Errorf("%v", err3)
	}
	return returnResult(cmd)
}

//returnResult run cmd and wait to output, which can be output or error
func returnResult(cmd *exec.Cmd) (string, error) {
	stderr, err := cmd.StderrPipe()
	stdout, err2 := cmd.StdoutPipe()
	if err != nil || err2 != nil {
		return "", fmt.Errorf("%v, %v", err, err2)
	}
	readerOut := bufio.NewReader(stdout)
	readerErr := bufio.NewReader(stderr)
	chout := make(chan string)
	cherr := make(chan string)
	go waitRead(chout, readerOut)
	go waitRead(cherr, readerErr)
	if err := cmd.Start(); nil != err {
		return "", fmt.Errorf("%v", err)
	}
	select {
	case s := <-chout:
		return s, nil
	case e := <-cherr:
		return "", fmt.Errorf(e)
	}
}

//waitRead read when will available
func waitRead(ch chan string, buf *bufio.Reader) {
	scanner := bufio.NewScanner(buf)
	scanner.Scan()
	ch <- scanner.Text()
}

//writePipe write arguments to cmd, warning script must be equal to script Accept
func writePipe(cmd *exec.Cmd, args ...string) error {
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return fmt.Errorf("%v", err)
	}
	for i := 0; i < len(args); i++ {
		_, err = stdin.Write([]byte(fmt.Sprintln(args[i])))
		if err != nil {
			return fmt.Errorf("error: %v, row: %v", err, i)
		}
	}
	return nil
}