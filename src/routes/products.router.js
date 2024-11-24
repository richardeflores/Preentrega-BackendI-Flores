import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new ProductManager();

// Ruta Raiz Get
router.get("/", async (req, res) => {
	try {
		const products = await productManager.getAll(req.query);
		res.status(200).json({ status: "success", payload: products });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

// Ruta Get /:pid
router.get("/:id", async (req, res) => {
	try {
		const product = await productManager.getOneById(req.params.id);
		res.status(200).json({ status: "success", payload: product });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

// Ruta para crear un producto, permite la subida de imágenes
router.post("/", uploader.single("thumbnail"), async (req, res) => {
	try {
		const product = await productManager.insertOne(req.body, req.file);
		res.status(201).json({ status: "success", payload: product });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

// Ruta PUT
router.put("/:id", uploader.single("file"), async (req, res) => {
	try {
		const product = await productManager.updateOneById(
			req.params.id,
			req.body,
			req.file
		);
		res.status(200).json({ status: "success", payload: product });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

//  Ruta Delete
router.delete("/:id", async (req, res) => {
	try {
		await productManager.deleteOneById(req.params.id);
		res.status(200).json({ status: "success" });
	} catch (error) {
		res
			.status(error.code || 500)
			.json({ status: "error", message: error.message });
	}
});

export default router;
