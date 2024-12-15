import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();
const currentCartId = "675d9f0c8b60ee7311550c4c";

router.get("/products", async (req, res) => {
	try {
		const data = await productManager.getAll(req.query);
		data.sort = req.query?.sort ? `&sort=${req.query.sort}` : "";
		data.currentCartId = currentCartId;
		data.docs = data.docs.map((doc) => {
			return { ...doc, currentCartId };
		});
		res.status(200).render("home", { title: "Inicio", data });
	} catch (error) {
		console.log(error.message);
		res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
	}
});

router.get("/realTimeProducts", async (req, res) => {
	try {
		res.render("realTimeProducts", { title: "Productos" });
	} catch (error) {
		res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
	}
});

export default router;
