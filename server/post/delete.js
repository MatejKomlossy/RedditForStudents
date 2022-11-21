const DB = require("../DB_main/db");
const {sqlPost} = require("./sqlPost");
const {canContinue} = require("../general/canContinue");
const {comonDelete} = require("../general/delete");

function preRatingDelete() {
    return async function (req, res) {
        try {
            const keys = ["id"]
            if (canContinue(req, res, keys, req.body) === false) {
                return;
            }
            req.body.student_id = req.session.id;
            const query = sqlPost.update({flag:false}).where(
                sqlPost.id.equals(req.body.id)
                    .and(sqlPost.student_id.equals(req.body.student_id)))
                .returning(sqlPost.id).toQuery();
            await comonDelete(query, res);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}

module.exports = {preRatingDelete}