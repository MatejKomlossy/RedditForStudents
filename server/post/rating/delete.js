const {auth} = require("../../general/controlLogin");
const DB = require("../../DB_main/db");
const {sqlRating} = require("./sqlRating");
const {canContinue} = require("../../general/canContinue");
const db = DB.getDbServiceInstance();

function preRatingDelete() {
    return async function (req, res) {
        try {
            const keys = ["post_id", "id"]
            if (canContinue(req, res, keys, req.body) === false) {
                return;
            }
            req.body.student_id = req.session.id;
            const query = sqlRating.delete().where(
                sqlRating.id.equals(req.body.id)
                    .and(sqlRating.student_id.equals(req.body.student_id)))
                .returning(sqlRating.id).toQuery();
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
        } catch (e) {
            res.status(500).send(e.toString());
        }


    }
}

module.exports = {preRatingDelete}