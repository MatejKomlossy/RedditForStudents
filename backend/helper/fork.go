package helper

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
)

func ForkOrContinue() {
	for {
		id, err := fork()
		if err != nil {
			_, err0 := fmt.Fprint(os.Stderr, err.Error())
			if err0 != nil {
				panic("Fatal error write to console do'nt work")
			}
		}
		if id == ChildProcess {
			break
		}
		sendFinishSignal()
	}
}

func sendFinishSignal() {
	for i := 0; i < howManySignal; i++ {
		chFinish <- true
	}
	howManySignal = 0
}

func fork() (int, error) {
	if contain(os.Args, flagChild) {
		IsParent = false
		return ChildProcess, nil
	}
	getExe()
	return ParentProcess, run(os.Args[0])
}

func contain(args []string, s string) bool {
	for i := 1; i < len(args); i++ {
		if args[i] == s {
			return true
		}
	}
	return false
}

func run(s string) error {
	cmd := exec.Command(s, flagChild)
	pipeErr, err := cmd.StderrPipe()
	if err != nil {
		return err
	}
	pipeOut, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	pipeIn, err := cmd.StdinPipe()
	if err != nil {
		return err
	}
	go waitErr(pipeErr)
	go controlServer(pipeOut, pipeIn, cmd)
	return cmd.Run()
}

func controlServer(pipeOut io.ReadCloser, pipeWriterIn io.WriteCloser, cmd *exec.Cmd) {
	commonCatch(pipeOut, func(str string) {
		if strings.Contains(str, Done) {
			err := setUrl(str)
			if err != nil {
				WriteMassageAsError(err, packages, "anonim from controlServer")
				return
			}
			howManySignal++
			go tryAlineServerIfNeedSendStop(pipeWriterIn, cmd)
			return
		}else {
			go writeAllOutputToLogInC(str)
		}
	})
}
func setUrl(str string) error {
	array := strings.Split(str, SplitChars)
	if len(array) != 2 {
		return fmt.Errorf("not url array %v", fmt.Sprint(array))
	}
	url = array[1]
	return nil
}

func waitErr(pipeErr io.ReadCloser) {
	commonCatch(pipeErr, func(str string) {
		go writeAllOutputToLogInC(str)
	})
}

func commonCatch(pipe io.ReadCloser, f func(str string)) {
	ch := getChanOutput(pipe)
	howManySignal++
	for {
		select {
		case str := <-ch:
			f(str)
		case <-chFinish:
			return
		}
	}
}

func getChanOutput(pipe io.ReadCloser) chan string {
	ch := make(chan string)
	go func() {
		scanner := bufio.NewScanner(pipe)
		scanner.Split(bufio.ScanWords)
		for scanner.Scan() {
			ch <- scanner.Text()
		}
	}()
	return ch
}

func getExe() {
	path, err := os.Getwd()
	if err != nil {
		writeAllOutputToLogInC(err.Error())
		return
	}
	writeAllOutputToLogInC(path)
}
