const {savePath, postCreate} = require("../contants/urlsPaths");
const {doFullPathMkdir} = require("./mkdirS");
const {prePostCreate} = require("./create");

class post {
    title
    post_text
    flag
    static initAppServices(app) {
        doFullPathMkdir(savePath)
        app.post(postCreate, prePostCreate((Object.keys(new post()))));

    }
}


module.exports =  {post}