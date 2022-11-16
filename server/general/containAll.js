
function containAllImportantMembers(body, keys) {
    for(let i=0; i<keys.length; i++){
        const value = keys[i];
        if (!body.hasOwnProperty(value)){
            return false;
        } else {
            if (body[value]==="" || body[value]===null || body[value]===undefined){
                return false;
            }
        }
    }
    return true;
}
module.exports = {containAllImportantMembers}