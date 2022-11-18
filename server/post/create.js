const {containAllImportantMembers} = require("../general/containAll");
const {sqlPost} = require("./sqlPost");
const {createImages} = require("../image/create");
const DB = require("../DB_main/db");
const {auth} = require("../general/controlLogin");
const db = DB.getDbServiceInstance();

async function createPostReturnId(post, client) {
    const query = sqlPost.insert([post])
        .returning(sqlPost.id).toQuery();
    console.log(query);
    const result = await client.query(query);
    console.log(result);
    return result;
}

async function createAll(body, res, client) {
    let result = await createPostReturnId(body.post, client);
    if (result instanceof Error) {
        throw result;
    }
    const postId = result.rows[0].id;
    if (body.imgs===undefined || body.imgs.length===0){
        return "create successful";
    }
    result = await createImages(body.imgs, postId, client);
    if (result instanceof Error) {
        throw result;
    }
    return "create successful";
}

function prePostCreate(keys){
    return async function(req, res) {
        try {
            if (auth(req, res)===false) {
                res.status(501).send({msg: "your session is over"});
                return;
            }
            if (containAllImportantMembers(req.body.post, keys)===false) {
                res.status(502).send({msg: "Please fill in all values in form"});
                return;
            }
            // TODO control images ?
            req.body.post.student_id = req.session.id;
            await db.doTransactions(req.body, res, createAll);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {prePostCreate}