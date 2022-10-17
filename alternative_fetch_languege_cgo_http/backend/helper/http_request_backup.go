package helper
/*
#include "http_request_backup.c"
 */
import "C"
import "unsafe"

func RunControl(port, addr string) {
	cPort := C.CString(port)
	cAddr := C.CString(addr)
	C.runReturnIfErr(cPort, cAddr)
	C.free(unsafe.Pointer(cPort))
	C.free(unsafe.Pointer(cAddr))
}
