const connect = require("./db-connect");

async function query(sql, values) {
  const db = await connect();

  const [rows, _] = await db.execute(sql, values);

  return rows;
}

module.exports = query;
