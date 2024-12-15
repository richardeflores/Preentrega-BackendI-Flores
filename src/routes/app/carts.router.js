import { Router } from "express";
import CartManager from "../../managers/CartManager.js";
import moment from "moment";
import ErrorManager from "../../managers/ErrorManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:id", async (req, res) => {
	try {
		const data = await cartManager.getOneById(req.params.id);
		data.createdAt = moment(data.createdAt).format("DD/MM/YYYY HH:mm:ss");
		data.updatedAt = moment(data.updatedAt).format("DD/MM/YYYY HH:mm:ss");

		res.status(200).render("cart", { title: "Carrito", data });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ status: false, ErrorManager });
	}
});

export default router;

// router.get("/carts", async (req, res) => {
// 	try {
// 		res.render("allCartsView", { title: "Carritos" });
// 	} catch (error) {
// 		res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
// 	}
// });

// router.get("/:cartId", async (req, res) => {
// 	const cartId = req.params.cartId;
// 	const cart = await CartManager.getCartById(cartId);
// 	res.render("cartView", { cart });
// });
