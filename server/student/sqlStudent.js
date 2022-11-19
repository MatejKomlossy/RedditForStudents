
const sql = require("sql");
sql.setDialect('postgres');
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