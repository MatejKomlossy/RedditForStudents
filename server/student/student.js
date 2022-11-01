const {studentRegister, studentLogin} = require("../contants/urls");
const {preRegistration} = require("./registration");
const {preLogin} = require("./login");

class student {
    nick_name
    isic_number
    password
    constructor() {
        this.nick_name = "temp"
        this.password = "temp"
        this.isic_number = "temp"
        
    }
    static initAppServices(app) {
        app.post(studentLogin, preLogin());
        app.post(studentRegister, preRegistration((Object.keys(new student()))));
    }
}


module.exports =  {student}