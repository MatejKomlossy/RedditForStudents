const {canContinue} = require("../../general/canContinue");
const DB = require("../../DB_main/db");
const {sqlRating} = require("./sqlRating");
const db = DB.getDbServiceInstance();

function preRatingCreate(keys) {
    return async function (req, res) {
        try {
            if (canContinue(req, res, keys, req.body) === false) {
                return;
            }
            req.body.student_id = req.session.student_id;
            const query = sqlRating.insert([req.body]).toQuery();
            const rows = await db.get_json_query(query);
            if (rows instanceof Error) {
                res.status(500).send({msg: rows.toString()});
                return;
            }
            res.status(200).send({msg: "create successful"})
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}

module.exports = {preRatingCreate}