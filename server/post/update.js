const {canContinue} = require("../general/canContinue");
const {sqlPost} = require("./sqlPost");
const {createImages} = require("../image/create");
const {deleteImages} = require("../image/delete");
const DB = require("../DB_main/db");
const db = DB.getDbServiceInstance();

async function updatePostReturnId(post, client) {
    const query = sqlPost.update(post)
        .where(sqlPost.id.equals(post.id))
        .returning(sqlPost.id).toQuery();
    console.log(query);
    const result = await client.query(query);
    console.log(result);
    return result;
}

async function updateAll(body, res, client) {
    let result = await updatePostReturnId(body.post, client);
    if (result instanceof Error) {
        throw result;
    }
    const postId = result.rows[0].id;
    const updateSuccessful = "update successful";
    if (body.imgs===undefined || body.imgs.length===0){
        return updateSuccessful;
    }
    await createImages(body.imgs, postId, client);
    if (body.deleted===undefined || body.deleted.length===0){
        return updateSuccessful;
    }
    await deleteImages(body.deleted, postId, client);
    return updateSuccessful;
}

function prePostUpdate(keys){
    return async function(req, res) {
        try {
            keys[keys.length] = 'id';
            if (canContinue(req, res, keys, req.body.post)===false) {
                return;
            }
            //TODO control images ?
            req.body.post.student_id = req.session.id;
            await db.doTransactions(req.body, res, updateAll);
        } catch (e) {
            res.status(500).send(e.toString());
        }
    }
}
module.exports =  {prePostUpdate}