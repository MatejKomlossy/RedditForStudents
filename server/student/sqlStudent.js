
const sql = require("sql");
const sqlStudent = sql.define({
    name: 'students',
    columns: [
        'id',
        'nick_name',
        'isic_number',
        'password'
    ]
});

module.exports =  {sqlStudent}