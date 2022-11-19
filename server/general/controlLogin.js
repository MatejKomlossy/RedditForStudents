const {hour} = require("../contants/date");
const {preLogout} = require("../student/logout");


function isAfterTimeOut(req) {
    return Math.floor(
        Math.abs(
            new Date(
                Date.now() + hour) - req.session.expire)
        / hour)
        > 0;
}

function isLogin(req) {
    return req.session.loggedin;
}

function auth(req, res) {
    try {
        const timeOut = isAfterTimeOut(req);
        if (timeOut){
            preLogout()(req, res)
            return false
        }
        return isLogin(req)
    }catch (e) {
        return false;
    }
}
module.exports = {auth}