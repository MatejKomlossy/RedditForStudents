const crypto = require("crypto");
const DB = require("../DB_main/db");
const {studentSQL} = require("./sqlTable");
const db = DB.getDbServiceInstance();
function preLogin(){
    return  async function(req, res) {
        try {
            const body = req.body;
            console.log("SNAZIM SA PRIHLASIT S: ", body.nick_name);
            if (req.session.users !== undefined) {
                for (let i in req.session.users) {
                    if (req.session.users[i].nick_name == body.nick_name && req.session.users[i].logged_in === true) {
                        console.log("CONS  ", req.session.users[i].nick_name,body.nick_name )
                        res.status(500).send({msg: "User is already logged in"});
                        return;
                    } 
                }
            }
            const query = await studentSQL
                .select(studentSQL.star())
                .from(studentSQL)
                .where(studentSQL.nick_name.equals(body.nick_name))
                .toQuery();
            const rows = await db.get_json_query(query);
            if (rows instanceof Error) {
                res.status(500).send(rows.toString());
                return;
            }
            if (!rows.length) {
                res.status(500).send({msg: "wrong username or password"});
                return;
            }
            const row = rows[0];
            const hash = crypto.createHash('sha256').update(req.body.password).digest('hex').toString();
            if (row.password===hash) {
                if (req.session.users === undefined) {
                    req.session.users = [];
                }
                console.log("ROW_NICKNAME: ", row.nick_name)
                req.session.users.push({"nick_name": row.nick_name, "logged_in": true});
                //res.cookie(row.nick_name, true);
                delete row["password"];
                req.session.loggedin = true;
                req.session.nick_name = row.nick_name;
                console.log(req.session)
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