const crypto = require("crypto");
const DB = require("../DB_main/db");
const {sqlStudent} = require("./sqlStudent");
const {hour} = require("../contants/date.js");

const db = DB.getDbServiceInstance();

async function getUserByName(nick_name) {
    const query = await sqlStudent
        .select(sqlStudent.star())
        .from(sqlStudent)
        .where(sqlStudent.nick_name.equals(nick_name))
        .toQuery();
    return await db.get_json_query(query);
}

function preLogin(){
    return  async function(req, res) {
        try {
            const rows = await getUserByName(req.body.nick_name);
            if (rows instanceof Error) {
                res.status(500).send({msg: rows.toString()});
                return;
            }
            if (!rows.length) {
                res.status(500).send({msg: "wrong username or password"});
                return;
            }
            const row = rows[0];
            const hash = crypto.createHash('sha256').
            update(req.body.password).digest('hex').toString();
            if (row.password===hash) {
                delete row["password"];
                req.session.loggedin = true;
                req.session.student_id = row.id;
                req.session.nick_name = row.nick_name;
                req.session.expire = new Date(Date.now() + hour);
                res.status(200).json(row);
            } else {
                res.status(500).send({msg: "wrong username or password"});
            }
        } catch (e) {
            res.status(500).send({msg: e.toString()});
        }
    }
}
module.exports =  {preLogin}
