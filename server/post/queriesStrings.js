
const fs = require('fs');
const getAllQueries =  fs.readFileSync('post/queries/getAll.sql',
    {encoding:'utf8', flag:'r'});
const getOneIDQueries =  fs.readFileSync('post/queries/getOneID.sql',
    {encoding:'utf8', flag:'r'});


module.exports = {
    getAllQueries, getOneIDQueries
}