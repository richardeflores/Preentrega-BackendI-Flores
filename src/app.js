import express from "express";
import dotenv from "dotenv";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";
import routerUsers from "./routes/users.router.js";
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerViewHome from "./routes/home.view.router.js";

const app = express();
dotenv.config();
connectDB();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configHandlebars(app);
app.use("/api/public", express.static("./src/public"));
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCart);
app.use("/api/users", routerUsers);
app.use("/", routerViewHome);
app.use("*", (req, res) => {
	res.status(404).render("error404", { title: "Error 404" });
});

const httpServer = app.listen(PORT, () => {
	console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);
