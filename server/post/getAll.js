const {auth} = require("../general/controlLogin");
const DB = require("../DB_main/db");
const {getAllQueries} = require("./queriesStrings");
const {sqlPost} = require("./sqlPost");
const db = DB.getDbServiceInstance();

function prePostGetAll(){
    return async function(req, res) {
        try {
            if (auth(req, res)===false) {
                return;
            }
            const query = {
                text: getAllQueries,
                values: [req.session.student_id]
            }
            console.log(query)
            const rows = await db.get_json_query(query);
            if (rows instanceof Error) {
                res.status(500).send({msg: rows.toString()});
                return;
            }
            res.status(200).json(rows);
        } catch (e) {
            res.status(500).send({msg: e.toString()});
        }
    }
}
module.exports =  {prePostGetAll}