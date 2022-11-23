
const sql = require("sql");
sql.setDialect('postgres');
const sqlRating = sql.define({
    name: 'ratings',
    columns: [
        'id',
        'category',
        'post_id',
        'student_id'
    ]
});
module.exports =  {sqlRating}