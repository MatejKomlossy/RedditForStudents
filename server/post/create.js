const {canContinue} = require("../general/canContinue");
const {sqlPost} = require("./sqlPost");
const {createImages} = require("../image/create");
const DB = require("../DB_main/db");
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
    const createSuccessful = "create successful";
    if (body.imgs===undefined || body.imgs.length===0){
        return createSuccessful;
    }
    await createImages(body.imgs, postId, client);
    return createSuccessful;
}

function prePostCreate(keys){
    return async function(req, res) {
        try {
            if (canContinue(req, res, keys, req.body.post)===false) {
                return;
            }
            //TODO control images ?
            req.body.post.student_id = req.session.id;
            await db.doTransactions(req.body, res, createAll);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {prePostCreate}