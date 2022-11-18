const sql = require("sql");

const sqlImage = sql.define({
    name: 'images',
    columns: [
        'id',
        'alt',
        'post_id'
    ]
});


module.exports =  {sqlImage}