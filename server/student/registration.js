const crypto = require("crypto");
const {sqlStudent} = require("./sqlStudent");
const DB = require("../DB_main/db");
const {containAllImportantMembers} = require("../general/containAll");
const fetch = require("cross-fetch");
const db = DB.getDbServiceInstance();

async function isIsicActive(isic) {
    try {
        const url = new URL('http://online.syts.sk/overenie/')
        const params = {jscp: isic, thisSubmit: "Vyhľadať"}
        url.search = new URLSearchParams(params).toString();
        return await fetch(url).then(response => response.text())
            .then(str =>  str.match( new RegExp('(je platná do)', 'g')))
            .then(match => match!==null)
    } catch (err) {
        console.error(err);
        return false;
    }
}

function preRegistration(keys){
    return async function(req, res) {
            try {
                const body = req.body;
                body.password = crypto.createHash('sha256').
                update(body.password).digest('hex').toString();
                console.log(body.password)
                if (containAllImportantMembers(body, keys)) {
                    if (await isIsicActive(body.isic_number)) {
                        let query = sqlStudent.insert([body])
                            .returning(sqlStudent.id).toQuery();
                        console.log(query);
                        const result = await db.get_json_query(query);
                        console.log(result);
                        if (result instanceof Error) {
                            res.status(500).send({msg: "student already registered"});
                            return;
                        }
                        res.status(200).send({msg: "registration successful"});
                        return;
                    }
                    res.status(500).send({msg: "ISIC card is not active"});
                } else {
                    res.status(502).send({msg: "Please fill out the registration form"});
                }
            } catch (e) {
                res.status(500).send(e.toString());
            }
        }
}
module.exports =  {preRegistration}