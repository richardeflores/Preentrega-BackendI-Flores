import { Router } from "express";
import ProductManager from "../../managers/ProductManager.js";
import moment from "moment";
import ErrorManager from "../../managers/ErrorManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/:id/cart/pid", async (req, res) => {
	try {
		const { id, pid: cartId } = req.params;
		const data = await productManager.getOneById(id);
		data.createdAt = moment(data.createdAt).format("DD/MM/YYYY HH:mm:ss");
		data.updatedAt = moment(data.updatedAt).format("DD/MM/YYYY HH:mm:ss");
		data.currentCartId = cartId;

		res.status(200).render("product", { title: "Producto", data });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ status: false, ErrorManager });
	}
});

export default router;
