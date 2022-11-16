function preLogout() {
    return async function (req, res) {
        try {
            if (req.session.loggedin) {
                req.session.loggedin = false;
                req.session.nick_name = "";
                req.session.destroy();
                res.status(200).send({msg: "Successfully logged out"});
                return;
            }
            res.status(500).send({msg: "not need logged out"});

        } catch (e) {
            res.status(500).send({msg: e.toString()});
        }
    }
}

module.exports = {preLogout}