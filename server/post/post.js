const {savePath} = require("../contants/urlsPaths");
const {doFullPathMkdir} = require("./mkdirS");

class post {
    title
    post_text
    student_id
    flag
    static initAppServices(app) {
        doFullPathMkdir(savePath)
    }
}


module.exports =  {post}