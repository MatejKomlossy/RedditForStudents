const {imageGetOne} = require("../contants/urlsPaths");
const {preImageGetOneID} = require("./getByID");

class image {
    static initAppServices(app) {
        app.post(imageGetOne, preImageGetOneID());
    }
}
module.exports =  {image}