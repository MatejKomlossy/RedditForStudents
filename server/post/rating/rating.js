const {postRating} = require("../../contants/urlsPaths");
const {preRatingCreate} = require("./create");

class rating {
    category
    post_id
    student_id
    static initAppServices(app) {
        app.post(postRating, preRatingCreate((Object.keys(new rating()))));

    }
}