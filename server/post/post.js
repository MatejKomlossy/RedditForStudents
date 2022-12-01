const {savePath, postRatingUpdate, postCreate, postGetAll, postGetOne, postDelete, postRatingDelete, postIsAuthorGet} = require("../contants/urlsPaths");
const {doFullPathMkdir} = require("./mkdirS");
const {prePostCreate} = require("./create");
const {prePostGetAll} = require("./getAll");
const {prePostGetOneID} = require("./getOneID");
const {prePostUpdate} = require("./update");
const {prePostDelete} = require("./delete");
const {rating} = require("./rating/rating");
const {preIsStudentAuthor} = require("./isAuthor");

class post {
    title
    post_text
    flag
    static initAppServices(app) {
        doFullPathMkdir(savePath);
        rating.initAppServices(app);
        app.post(postCreate, prePostCreate((Object.keys(new post()))));
        app.get(postGetAll, prePostGetAll());
        app.post(postGetOne, prePostGetOneID());
        app.post(postRatingUpdate, prePostUpdate((Object.keys(new post()))));
        app.delete(postDelete, prePostDelete());
        app.post(postIsAuthorGet, preIsStudentAuthor());
    }
}
module.exports =  {post}