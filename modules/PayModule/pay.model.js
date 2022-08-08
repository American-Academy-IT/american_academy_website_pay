const Sequelize = require("sequelize");
const { connectionSqlz } = require("../../configration/config");

const User = connectionSqlz.define(
  'user',
  {
    id:
    {
      type:Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullName:
    {
      type: Sequelize.STRING(100),
      defaultValue: 't'
    },
    nationalID:
    {
      type: Sequelize.INTEGER(100),
      defaultValue: 2
    },
    PhoneNumber:
    {
      type: Sequelize.INTEGER(200),
      defaultValue: 4
    },
    SelectCourse:
    {
      type: Sequelize.STRING(100),
      defaultValue: 'r'
    }
  },
  {
    timeStamps: true
  }
);

module.exports = User;