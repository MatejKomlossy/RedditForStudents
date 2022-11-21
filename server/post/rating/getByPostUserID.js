const {canContinue} = require("../../general/canContinue");
const DB = require("../../DB_main/db");
const {sqlRating} = require("./sqlRating");
const db = DB.getDbServiceInstance();

function getByPostUserID() {
    return async function (req, res) {
        try {
            const keys = ['post_id'];
            if (canContinue(req, res, keys, req.body) === false) {
                return;
            }
            req.body.student_id = req.session.id;
            const query = sqlRating.select(sqlRating.star())
                .where(sqlRating.post_id.equals(req.body.post_id)
                    .and(sqlRating.student_id.equals(req.body.student_id)))
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

module.exports = {getByPostUserID}