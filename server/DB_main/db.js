const {rows} = require("pg/lib/defaults");
const Pool = require('pg').Pool;
let instance = null;

const pool  = new Pool({
    host     : 'localhost',
    user     : 'postgres',
    password : 'postgres',
    database : 'RedditForStudents',
    port     : 5432
});

class DB {
    static conecction = 0;

    static getDbServiceInstance() {
        return instance ? instance : new DB();
    }

    async get_json_query(query) {
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            return new Error(error);
        }
    }
}

module.exports = DB;
