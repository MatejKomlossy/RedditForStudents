const {auth} = require("../general/controlLogin");
const {sqlPost} = require("./sqlPost");
const {sqlRating} = require("./rating/sqlRating");
const DB = require("../DB_main/db");
const {canContinue} = require("../general/canContinue");
const db = DB.getDbServiceInstance();

function prePostGetOne(){
    return async function(req, res) {
        try {
            const keys = ["id"];
            if (canContinue(req, res, keys, req.body)===false) {
                return;
            }
            const query = sqlPost.select("*")
                .from(sqlPost.leftJoin(sqlRating)
                    .on(sqlPost.id.equals(sqlRating.post_id)))
                .order(sqlPost.changed)
                .where(sqlPost.flag.equals(true).and(sqlPost.id.equals(req.body.id)))
                .toQuery();
            const rows = await db.get_json_query(query);
            if (rows instanceof Error) {
                res.status(500).send({msg: rows.toString()});
                return;
            }
            res.status(200).json(rows);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {prePostGetOne}