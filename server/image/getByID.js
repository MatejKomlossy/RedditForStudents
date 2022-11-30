const {canContinue} = require("../general/canContinue");
const Path = require("path");
const {savePath} = require("../contants/urlsPaths");

function preImageGetOneID(){
    return async function(req, res) {
        try {
            const keys = ["id", "mextname"];
            if (canContinue(req, res, keys, req.body)===false) {
                return;
            }
            res.writeHead(200,{'content-type':('image/'+req.body.mextname)});
            res.sendFile(
                Path.join(savePath,req.body.id+'.'+req.body.mextname)
            );
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {preImageGetOneID}