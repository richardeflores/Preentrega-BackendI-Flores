import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerViewHome from "./routes/home.view.router.js";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
configHandlebars(app);
app.use("/api/public", express.static("./src/public"));
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCart);
app.use("/", routerViewHome);

const httpServer = app.listen(PORT, () => {
	console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);
