import { Router } from "express";
import UserManager from "../managers/UserManager.js";

const router = Router();
const userManager = new UserManager();

router.get("/", async (req, res) => {
	try {
		const users = await userManager.getAll(req.query);
		res.status(200).json({ status: "success", payload: users });
	} catch (error) {
		res.status(error.code).json({ status: "error", message: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const user = await userManager.getOneById(req.params.id);
		res.status(200).json({ status: "success", payload: user });
	} catch (error) {
		res.status(error.code).json({ status: "error", message: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const user = await userManager.insertOne(req.body);
		res.status(201).json({ status: "success", payload: user });
	} catch (error) {
		res.status(error.code).json({ status: "error", message: error.message });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const user = await userManager.updateOneById(req.params.id, req.body);
		res.status(200).json({ status: "success", payload: user });
	} catch (error) {
		res.status(error.code).json({ status: "error", message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await userManager.deleteOneById(req.params.id);
		res.status(200).json({ status: "success" });
	} catch (error) {
		res.status(error.code).json({ status: "error", message: error.message });
	}
});

export default router;
