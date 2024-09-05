const createRoles = async (Role) => {
  try {
    const count = await Role.count();
    if (count > 0) return console.log("Roles ya han sido creados");

    const roles = ["Admin", "User"];

    for (const roleName of roles) {
      await Role.findOrCreate({ where: { name: roleName } });
    }

    console.log("Roles han sido creados");
  } catch (error) {
    console.log("Ocurrió un error al crear los roles: ", error);
  }
};

module.exports = createRoles;
