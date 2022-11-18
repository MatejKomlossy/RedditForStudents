
const sql = require("sql");
const sqlPost = sql.define({
    name: 'posts',
    columns: [
        'id',
        'title',
        'post_text',
        'student_id',
        'changed',
        'flag'
    ]
});

module.exports =  {sqlPost}