const bcrypt = require("bcrypt");
const {studentSQL} = require("./sqlTable");
const DB = require("../DB_main/db");


const db = DB.getDbServiceInstance();

async function isIsicActive(isic) {
    try {
        return await fetch('http://online.syts.sk/overenie/?' + new URLSearchParams({
            jscp: isic.toString(),
            thisSubmit: "Vyhľadať"
        }))
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
                const salt = await bcrypt.genSalt();
                const body = req.body;
                console.log(body)
                body.password = await bcrypt.hash(body.password, salt);
                if (containAllImportantMembers(body, keys)) {
                    if (await isIsicActive(body.isic_number)) {
                        let query = studentSQL.insert([body]).returning(studentSQL.id).toQuery();
                        console.log(query);
                        const result = await db.get_json_query(query);
                        console.log(result);
                        if (result instanceof Error) {
                            res.status(500).send("no rows from db");
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