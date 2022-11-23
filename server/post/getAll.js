const {auth} = require("../general/controlLogin");
const DB = require("../DB_main/db");
const db = DB.getDbServiceInstance();

function prePostGetAll(){
    return async function(req, res) {
        try {
            if (auth(req, res)===false) {
                return;
            }
            const query = "SELECT \"posts\".*, sum(category) as rating\n" +
                "FROM \"posts\" LEFT JOIN \"ratings\" ON (\"posts\".\"id\" = \"ratings\".\"post_id\")\n" +
                "WHERE (\"posts\".\"flag\" = true)\n" +
                "GROUP BY \"posts\".\"id\"\n" +
                "having count(category) filter ( where category=0 ) < 7 --const  or rations ?";
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