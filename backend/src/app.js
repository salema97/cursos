const express = require("express");
const cors = require("cors");
const UserRoutes = require("./routes/user.routes");
const AccountRoutes = require("./routes/account.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/account", AccountRoutes);
app.use("/api/users", UserRoutes);

module.exports = app;
