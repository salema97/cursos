const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const createRoles = require("../libs/initial.setup");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Roles",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log('La tabla "Roles" ha sido sincronizada');
    createRoles(Role);
  })
  .catch((error) => {
    "Ocurrió un error en Roles: ", console.log(error);
  });

module.exports = Role;
