function preLogout(){
    return  async function(req, res) {
        try {
            // console.log(getcookie(req));
            // //cookieParser.signedCookies(cookies, secret)
            // console.log("SESSION PRED LOGOUT: ", req.session.users)
            // console.log("REQ.cookies: ",cookieParser(req.cookies, "secret"))
            //console.log(req.cookies)

            // V logout-e nemame pristup k req.session, cize nevieme odstranit pouzivatela zo zoznamu req.session.users
            // Treba to zrejme riesit inym sposobom...
            for (let i in req.session.users) {
                if (req.session.users[i].nick_name === req.body.nick_name) {
                    //console.log("DELETING...");
                    req.session.users[i].logged_in = false;
                }
            }
            //console.log("SESSION AFTER LOGOUT: ", req.session.users)
            req.session.destroy();  // Toto je sucast povodneho riesenia, teda odstranuje celu session (vsetkych userov)
            res.status(200).json({"logout":"OK"});
        } catch (e) {
            res.status(500).send({msg: e.toString()});
        }
    }
}


function getcookie(req) {
    let cookie = req.headers.cookie;
    // user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN (this is my cookie i get)
    return cookie.split('; ');
}

module.exports = preLogout