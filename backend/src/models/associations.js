const User = require("./user");
const Role = require("./role");
const Device = require("./device");
const Product = require("./product");
const Category = require("./category");

User.belongsToMany(Role, { through: "UserRoles", foreignKey: "userId" });
Role.belongsToMany(User, { through: "UserRoles", foreignKey: "roleId" });

User.hasMany(Device, { foreignKey: "userId", as: "devices" });
Device.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "CASCADE",
});
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

module.exports = { User, Role, Device, Product, Category };
