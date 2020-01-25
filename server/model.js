const { Pool } = require('pg');

const pool = new Pool({
  connectionString: `postgres://qmlyvmbj:ZVx-QAi92zDTQXINNanYS7YS-5D2G87Z@rajje.db.elephantsql.com:5432/qmlyvmbj`
});

module.exports = {
  query: (text, params, callback) => {
    console.log('Executed query', text);
    return pool.query(text, params, callback);
  }
}