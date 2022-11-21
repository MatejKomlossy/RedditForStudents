const {savePath, postCreate, postGetAll, postGetOne} = require("../contants/urlsPaths");
const {doFullPathMkdir} = require("./mkdirS");
const {prePostCreate} = require("./create");
const {prePostGetAll} = require("./getAll");
const {prePostGetOneID} = require("./getOneID");
const {preRatingDelete} = require("./delete");
const {rating} = require("./rating/rating");

class post {
    title
    post_text
    flag
    static initAppServices(app) {
        doFullPathMkdir(savePath);
        rating.initAppServices(app);
        app.post(postCreate, prePostCreate((Object.keys(new post()))));
        app.post(postGetAll, prePostGetAll());
        app.post(postGetOne, prePostGetOneID());
        app.post(postGetOne, preRatingDelete());
    }
}
module.exports =  {post}