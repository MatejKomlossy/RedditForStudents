const {canContinue} = require("../general/canContinue");
const Path = require("path");
const {savePath} = require("../contants/urlsPaths");
const fs = require("fs");

function preImageGetOneID(){
    return async function(req, res) {
        try {
            const keys = ["id", "mextname"];
            if (canContinue(req, res, keys, req.body)===false) {
                return;
            }
            res.writeHead(200,{'content-type':('image/'+req.body.mextname)});
            fs.createReadStream(
                Path.join(savePath,req.body.id + req.body.mextname)
            ).pipe(res);

        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {preImageGetOneID}