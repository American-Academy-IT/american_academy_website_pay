//******  connection using sequelize ******//

const Sequelize = require("sequelize");

const connectionSqlz = new Sequelize("pay", "payData", "Abcd#1234", {
  host: process.env.Config_Host,
  dialect: "mysql",
});

const createTables = () => {
  connectionSqlz
    .sync()
    .then((result) => {
      console.log("database success connection");
    })
    .catch((err) => {
      console.log("database error connection");
    });
};

module.exports = {
  connectionSqlz,
  createTables,
};
