
const {auth} = require("../../general/controlLogin");
const {containAllImportantMembers} = require("../../general/containAll");
const db = DB.getDbServiceInstance();

function preRatingCreate(keys){
    return async function(req, res) {
    }
}
module.exports =  {preRatingCreate}