const crypto = require("crypto");
const {studentSQL} = require("./sqlTable");
const DB = require("../DB_main/db");
const fetch = require("cross-fetch");

const db = DB.getDbServiceInstance();

async function isIsicActive(isic) {
    try {
        
        const url = new URL('http://online.syts.sk/overenie/')
        const params = {jscp: isic, thisSubmit: "Vyhľadať"}
        url.search = new URLSearchParams(params).toString();
        return await fetch(url)
            .then(response => response.text())
            .then(str =>  str.match( new RegExp('(je platná do)', 'g')))
            .then(match => match!==null)
    } catch (err) {
        console.error(err);
        return false;
    }
}


function containAllImportantMembers(body, keys) {
    for(let i=0; i<keys.length; i++){
        const value = keys[i];
        if (!body.hasOwnProperty(value)){
            return false;
        } else {
            if (body[value]==="" || body[value]===null || body[value]===undefined){
                return false;
            }
        }
    }
    return true;
}
function preRegistration(keys){
    return async function(req, res) {
            try {
                const body = req.body;
                body.password =  crypto.createHash('sha256').update(body.password).digest('hex').toString();

                if (containAllImportantMembers(body, keys)) {
                    if (await isIsicActive(body.isic_number)) {
                        let query = studentSQL.insert([body]).returning(studentSQL.id).toQuery();
                        console.log(query);
                        const result = await db.get_json_query(query);
                        console.log(result);
                        if (result instanceof Error) {
                            res.status(500).send(result.toString());
                            return;
                        }
                        res.status(200).send("student was registrate");
                        return;
                    }
                    res.status(500).send("isic number is not active");
                } else {
                    res.status(500).send("it does not contain all important members " +
                        "it must contains: " + keys.toString());
                }
            } catch (e) {
                res.status(500).send(e.toString());
            }
        }
}
module.exports =  {preRegistration}