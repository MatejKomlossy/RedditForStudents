const {postRatingCreate, postRatingUpdate, postRatingDelete} = require("../../contants/urlsPaths");
const {preRatingCreate} = require("./create");
const {preRatingUpdate} = require("./update");
const {preRatingDelete} = require("./delete");

class rating {
    category
    post_id
    static initAppServices(app) {
        app.post(postRatingCreate, preRatingCreate((Object.keys(new rating()))));
        app.post(postRatingUpdate, preRatingUpdate((Object.keys(new rating()))));
        app.post(postRatingDelete, preRatingDelete());

    }
}
module.exports =  {rating}