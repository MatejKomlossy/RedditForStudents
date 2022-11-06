function preLogout(){
    return  async function(req, res) {
        try {
            req.session.destroy();
            res.status(200).json({"logout":"OK"});
        } catch (e) {
            res.status(500).send({msg: e.toString()});
        }
    }
}

module.exports = preLogout