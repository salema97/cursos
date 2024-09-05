const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Device = sequelize.define(
  "Device",
  {
    deviceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "Devices",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log('La tabla "Devices" ha sido sincronizada');
  })
  .catch((error) => {
    "Ocurrió un error en Devices: ", console.log(error);
  });

module.exports = Device;
