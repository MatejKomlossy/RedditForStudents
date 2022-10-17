// inspiration from https://github.com/orcaman/concurrent-map/blob/master/concurrent_map.go

package helper

import (
	"sync"
	"time"
)

type Item struct {
	howMuch int
	wasBlock bool
	sync.Mutex
}

func (i *Item) HowMuchBlock() (time.Duration, bool) {
	n := i.Get()
	if n >= 15 && i.wasBlock {
		return time.Hour, true
	}
	if n >= 5 && !i.wasBlock {
		i.wasBlock = true
		return time.Minute*5, true
	}
	return time.Duration(1), false
}


func (i *Item) Get() int {
	i.Lock()
	defer i.Unlock()
	return i.howMuch
}

func (i *Item) Inc() {
	i.Lock()
	i.howMuch++
	i.Unlock()
}

func (i *Item) Dec() {
	i.Lock()
	i.howMuch--
	i.Unlock()
}

func (i *Item) Set(n int) {
	i.Lock()
	i.howMuch = n
	i.Unlock()
}

func NewItem() *Item {
	return &Item{howMuch: 1, wasBlock: false}
}

type AllowMap struct {
	items        map[string]*Item
	sync.RWMutex
}

type Maps []*AllowMap

func newAllowMap(n int) *AllowMap {
	return &AllowMap{items: make(map[string]*Item, n)}
}

func NewMaps(n,size int) *Maps {
	result := make(Maps,0,size)
	for i := 0; i < size; i++ {
		result = append(result, newAllowMap(n))
	}
	return &result
}

// GetShard returns shard under given key
func (m Maps) GetShard(key string) *AllowMap {
	return m[fnv32(key)%uint32(len(m))]
}

func fnv32(key string) uint32 {
	hash := uint32(2166136261)
	const prime32 = uint32(16777619)
	keyLength := len(key)
	for i := 0; i < keyLength; i++ {
		hash *= prime32
		hash ^= uint32(key[i])
	}
	return hash
}

func (m Maps) Set(key string, value *Item) {
	shard := m.GetShard(key)
	shard.Lock()
	shard.items[key] = value
	shard.Unlock()
}


func (m Maps) Get(key string) ( *Item, bool) {
	shard := m.GetShard(key)
	shard.RLock()
	val, ok := shard.items[key]
	shard.RUnlock()
	return val, ok
}

func (m Maps) Delete(key string) {
	shard := m.GetShard(key)
	shard.Lock()
	delete(shard.items, key)
	shard.Unlock()
}

func (m Maps) UpdateOrCreateSetWithoutLock(key string) *Item {
	shard := m.GetShard(key)
	it, ok := shard.items[key]
	if ok {
		it.Inc()
		return it
	}
	it = NewItem()
	m.Set(key, it)
	return it
}