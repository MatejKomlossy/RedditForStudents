const {sqlPost} = require("./sqlPost");

function preIsStudentAuthor() {
    return async function (req, res) {
        try {
            req.body.student_id = req.session.student_id;

            const query = sqlPost.select(sqlPost.star()).where(
                sqlPost.id.equals(req.body.post_id)
                    .and(sqlPost.student_id.equals(req.body.student_id))).toQuery();

            const rows = await db.get_json_query(query);

            if (rows instanceof Error) {
                res.status(500).send({msg: rows.toString()});
                return;
            }
            if (!rows.length) {
                res.status(200).send(false);
                return;
            }
            res.status(200).send(true);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}

module.exports = {preIsStudentAuthor}