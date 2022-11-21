const {postRatingCreate, postRatingUpdate, postRatingDelete,postRatingGet} = require("../../contants/urlsPaths");
const {preRatingCreate} = require("./create");
const {preRatingUpdate} = require("./update");
const {preRatingDelete} = require("./delete");
const {getByPostUserID} = require("./getByPostUserID");
class rating {
    category
    post_id
    static initAppServices(app) {
        app.post(postRatingCreate, preRatingCreate((Object.keys(new rating()))));
        app.post(postRatingUpdate, preRatingUpdate((Object.keys(new rating()))));
        app.post(postRatingDelete, preRatingDelete());
        app.post(postRatingGet, getByPostUserID());

    }
}
module.exports =  {rating}