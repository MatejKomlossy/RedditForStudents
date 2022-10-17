package connection_database

import (
	h "backend/helper"
	"backend/paths"
	"github.com/gin-gonic/gin"
	"net"
	"strings"
	"time"
)

func preAuthFunc(function func(ctx *gin.Context)) func(ctx *gin.Context) {

	/*return func(ctx *gin.Context) {
		if debug {
			h.Log(ctx.Request)
		}
		if isAutoAllow(ctx.Request.URL.Path) {
			if SetHeadersReturnIsContinue(ctx) {
				function(ctx)
			}
			return
		}
		if it, ok := isAllowIPAdress(ctx.Request.RemoteAddr); debug || ok {
			if ok {
				it.Set(100)
			}
			if SetHeadersReturnIsContinue(ctx) {
				function(ctx)
			}
			return
		}
		ctx.Writer.WriteHeader(http.StatusNotAcceptable)
		TODO MORE CLEVER TOKEN ::::::::::
	}*/
	return function
}

func isAllowIPAdress(addr string) (*h.Item, bool) {
	addr = getIpAddres(addr)
	return allow.Get(addr)
}

func getIpAddres(addr string) string {
	addres, _ := net.ResolveUDPAddr("udp", addr)
	if addres.IP.To4() != nil {
		return strings.Split(addr, ":")[0]
	}
	s := strings.Split(addr, ":")
	return strings.Join(s[:len(s)-1], ":")
}

func isAutoAllow(requestPath string) bool {
	switch requestPath {
	case paths.Combinations, paths.Branches,
		paths.Cities, paths.Departments, paths.Divisions,
		paths.Login, paths.Kiosk, paths.Control:
		return true
	default:
		return false
	}
}

func logout(ctx *gin.Context) {
	/*addr := getIpAddres(ctx.Request.RemoteAddr)
	allow.Delete(addr)*/
	// TODO MORE CLEVER TOKEN ::::::::::
}

func AllowAddress(address string) {
	go func() {
		it := h.NewItem()
		it.Set(100)
		addr := getIpAddres(address)
		allow.Set(addr, it)
		for {
			time.Sleep(time.Minute)
			it.Dec()
			if it.Get() <= 0 {
				allow.Delete(addr)
				return
			}
		}
	}()
}

func AddWarning(name string) {
	go func() {
		sh := warnings.GetShard(name)
		it := warnings.UpdateOrCreateSetWithoutLock(name)
		sh.Lock()
		if d, ok := it.HowMuchBlock(); ok {
			go blockDuration(d, name, it)
			sh.Unlock()
			return
		}
		sh.Unlock()
		time.Sleep(time.Minute * 4)
		it.Dec()
		sh.Lock()
		if it.Get() == 0 {
			warnings.Delete(name)
		}
		sh.Unlock()
	}()
}

func blockDuration(d time.Duration, name string, it *h.Item) {
	refuse.Set(name, it)
	time.Sleep(d)
	refuse.Delete(name)
	it.Set(0)
	if d == time.Hour {
		warnings.Delete(name)
	}
}

func AllowName(name string) {
	warnings.Delete(name)
	refuse.Delete(name)
}

func IsRefused(name string) bool {
	_, ok := refuse.Get(name)
	return ok
}
