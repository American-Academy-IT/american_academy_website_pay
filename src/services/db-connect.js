const mysql = require("mysql2/promise");

async function dbConnect() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  };

  const pool = await mysql.createPool(config);
  pool.on("connection", (conn) => {
    conn.query("SET time_zone='+00:00';", (error) => {
      if (error) {
        throw error;
      }
    });
  });

  return pool;
}

module.exports = dbConnect;
