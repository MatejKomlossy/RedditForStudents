const DB = require("../DB_main/db");
const db = DB.getDbServiceInstance();

async function comonDelete(query, res) {
    const rows = await db.get_json_query(query);
    if (rows instanceof Error) {
        res.status(500).send({msg: rows.toString()});
        return;
    }
    if (!rows.length) {
        res.status(500).send({msg: "delete unsuccessful"});
        return;
    }
    res.status(200).send({msg: "delete successful"});
}
module.exports = {comonDelete}