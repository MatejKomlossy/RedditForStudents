const DB = require("../DB_main/db");
const {canContinue} = require("../general/canContinue");
const {getOneIDQueries} = require("./queriesStrings");
const db = DB.getDbServiceInstance();

function prePostGetOneID(){
    return async function(req, res) {
        try {
            const keys = ["id"];
            if (canContinue(req, res, keys, req.body)===false) {
                return;
            }
            const query = {
                text: getOneIDQueries,
                values:  [req.session.student_id, req.body.id]
            };
            const rows = await db.get_json_query(query);
            if (rows instanceof Error) {
                res.status(500).send({msg: rows.toString()});
                return;
            }
            if (rows.length > 1) {
                res.status(500).send({msg: "found multiple posts"}); //shouldn't ever happen
                return;
            }
            res.status(200).json(rows[0]);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {prePostGetOneID}