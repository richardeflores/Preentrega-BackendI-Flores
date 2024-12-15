import express from "express";
import path from "./utils/paths.js";
import { connectDB } from "./config/mongoose.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import configWebsocket from "./config/websocket.config.js";
import routerViewHome from "./routes/app/home.router.js";
import routerProducts from "./routes/app/products.router.js";
import routerCart from "./routes/app/carts.router.js";
import routerApiProducts from "./routes/api/products.router.js";
import routerApiCart from "./routes/api/cart.router.js";
import { PORT } from "./config/config.js";

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routerViewHome);
app.use("/products", routerProducts);
app.use("/carts", routerCart);
app.use("/api/products", routerApiProducts);
app.use("/api/carts", routerApiCart);
app.use("/public", express.static(path.public));

configHandlebars(app);

app.use("*", (req, res) => {
	res.status(404).render("error404", { title: "Error 404" });
});

const httpServer = app.listen(PORT, () => {
	console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket.config(httpServer);
