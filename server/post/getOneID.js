const DB = require("../DB_main/db");
const {canContinue} = require("../general/canContinue");
const db = DB.getDbServiceInstance();

function prePostGetOneID(){
    return async function(req, res) {
        try {
            const keys = ["id"];
            if (canContinue(req, res, keys, req.body)===false) {
                return;
            }
            const query = {
                text: "SELECT \"posts\".*, sum(category) as rating\n" +
                "FROM \"posts\" LEFT JOIN \"ratings\" ON (\"posts\".\"id\" = \"ratings\".\"post_id\")\n" +
                "WHERE (\"posts\".\"flag\" = true)\n" +
                "GROUP BY \"posts\".\"id\"\n" +
                "having \"posts\".\"id\" = $1",
                values:  [req.body.id]
            };
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
module.exports =  {prePostGetOneID}