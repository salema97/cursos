const express = require("express");
const cors = require("cors");
const AccountRoutes = require("./routes/account.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/account", AccountRoutes);

module.exports = app;
