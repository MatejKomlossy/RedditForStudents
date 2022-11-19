const {auth} = require("./controlLogin");
const {containAllImportantMembers} = require("./containAll");

function canContinue(req, res, keys, object) {
    try {
        if (auth(req, res) === false) {
            res.status(501).send({msg: "your session is over"});
            return false;
        }
        if (containAllImportantMembers(object, keys) === false) {
            res.status(502).send({msg: "Please fill in all values in form"});
            return false;
        }
    } catch (e) {
        res.status(500).send(e.toString());
        return false;
    }
    return true;
}
module.exports =  {canContinue}