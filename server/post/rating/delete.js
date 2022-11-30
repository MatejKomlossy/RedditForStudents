const {sqlRating} = require("./sqlRating");
const {canContinue} = require("../../general/canContinue");
const {comonDelete} = require("../../general/delete");

function preRatingDelete() {
    return async function (req, res) {
        try {
            const keys = ["post_id"]
            if (canContinue(req, res, keys, req.body) === false) {
                return;
            }
            req.body.student_id = req.session.student_id;
            const query = sqlRating.delete().where(
                sqlRating.post_id.equals(req.body.post_id)
                    .and(sqlRating.student_id.equals(req.body.student_id)))
                .returning(sqlRating.id).toQuery();
            await comonDelete(query, res);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}

module.exports = {preRatingDelete}