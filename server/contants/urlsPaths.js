
const studentRegister = "/student/register";
const studentLogin = "/student/login";
const studentLogout = "/student/logout";

const postCreate = "/post/create";
const postHide = "/post/hide";
const postUpdate = "/post/update";
const postGetAll = "/post/get/all";
const postGetOne = "/post/get/one";

const postRatingCreate = "/post/rating/create";
const postRatingGet = "/post/rating/get";
const postRatingUpdate = "/post/rating/update";
const postRatingDelete = "/post/rating/delete";

const imageGetOne = "/image/one";

const savePath = "server/saved_images/db/retrieve/data"

module.exports =  {
    studentRegister, studentLogin, studentLogout,
    postCreate, postUpdate, postGetAll, postGetOne, postHide,
    postRatingCreate, postRatingUpdate, postRatingDelete,postRatingGet,
    imageGetOne,
    savePath
}