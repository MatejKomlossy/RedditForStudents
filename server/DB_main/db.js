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
        if (instance === null){
            instance = new DB();
        }
        return instance;
    }

    async get_json_query(query) {
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            return new Error(error);
        }
    }

    async doTransactions(body, res, fun) {
        const client = await pool.connect();
        try {
            const msg = await fun(body, res, client);
            await client.query('COMMIT');
            res.status(200).send({msg: msg});
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = DB;
