const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Categories",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log('La tabla "Categories" ha sido sincronizada');
  })
  .catch((error) => {
    "Ocurrió un error en Categories: ", console.log(error);
  });

module.exports = Category;
