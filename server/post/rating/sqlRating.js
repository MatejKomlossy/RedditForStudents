
const sql = require("sql");
const sqlRating = sql.define({
    name: 'posts',
    columns: [
        'id',
        'category',
        'post_id',
        'student_id'
    ]
});

module.exports =  {sqlRating}