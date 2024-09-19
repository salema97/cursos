const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const AccountRoutes = require("./routes/account.routes");
const CategoryRoutes = require("./routes/category.routes");
const ProductRoutes = require("./routes/product.routes");
const NotificationRoutes = require("./routes/notification.routes");
const StreamCategoryRoutes = require("./routes/stream.category.routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  socket.on("disconnect", () => {
    console.log("El cliente se ha desconectado");
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/account", AccountRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/notification", NotificationRoutes);

app.use("/socket/category", StreamCategoryRoutes(io));

module.exports = server;
