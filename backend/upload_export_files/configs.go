package upload_export_files


type employeeCsvConfig struct {
	AnetId     uint `json:"anet"`
	FirstName  uint `json:"first_name"`
	LastName   uint `json:"last_name"`
	Login      uint `json:"login"`
	Password   uint `json:"password"`
	Role       uint `json:"role"`
	Email      uint `json:"email"`
	JobTitle   uint `json:"job_title"`
	Manager    uint `json:"manager"`
	Branch     uint `json:"branch"`
	Division   uint `json:"division"`
	Department uint `json:"department"`
	City       uint `json:"city"`
	Import     uint `json:"import"`
	EFUUserId  uint `json:"efu_user_id"`
	Important []uint `json:"important"`
}

type cardCsvConfig struct {
	AnetIdCard uint `json:"anet_card"`
	NumberCard uint `json:"number_card"`
}

// csvConfig load and save config to import
type csvConfig struct {
	employeeCsvConfig `json:"employee"`
	cardCsvConfig `json:"card"`
}

// Login;PW;User ID (E,F,U);Anet ID;Priezvisko;Meno;Deň narodenia;Firemné číslo;Firemný mail;
//Nadriadený;Názov pracovnej pozície;Dcérska spoločnosť;Divízia;Oddelenie;Mesto;STIM Koordnátor ID;
//STIM Koordnátor ID;Nadriadený ID;Nadriadený ID;

// newDefaultConfig return configuration, which was known at coding process
func newDefaultConfig() *csvConfig {
	return &csvConfig{
		employeeCsvConfig{
			Import:     0,
			Login:      1,
			Password:   2,
			EFUUserId:  3,
			AnetId:     4,
			LastName:   5,
			FirstName:  6,
			Email:      9,
			JobTitle:   11,
			Branch:     12,
			Division:   13,
			Department: 14,
			Role:       14,
			City:       15,
			Manager:    18,
			Important: []uint{1,2,3,4,5,6,9},
		},
		cardCsvConfig{
			NumberCard: 2,
			AnetIdCard: 3,
		},
	}
}

func (c *csvConfig) setRightIndex() {
	c.Import--
	c.Login--
	c.Password--
	c.EFUUserId--
	c.AnetId--
	c.LastName--
	c.FirstName--
	c.Email--
	c.JobTitle--
	c.Branch--
	c.Division--
	c.Department--
	c.Role--
	c.City--
	c.Manager--
	c.NumberCard--
	c.AnetIdCard--
	for i := 0; i < len(c.Important); i++ {
		c.Important[i] = c.Important[i] - 1
	}
}
