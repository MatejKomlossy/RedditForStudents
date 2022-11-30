const {imageGet} = require("../contants/urlsPaths");
const {preImageGetOneID} = require("./getByID");

class image {
    static initAppServices(app) {
        app.post(imageGet, preImageGetOneID());
    }
}
module.exports =  {image}