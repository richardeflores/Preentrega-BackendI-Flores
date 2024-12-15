import mongoose from "mongoose";
import mongoDB from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
	#cartModel;

	constructor() {
		this.#cartModel = CartModel;
	}

	// Obtiene todos los carritos con opciones de paginación y populate
	getAll = async (params) => {
		try {
			const sort = {
				asc: { name: 1 },
				desc: { name: -1 },
			};

			const paginationOptions = {
				limit: params?.limit ?? 4,
				page: params?.page ?? 1,
				sort: sort[params?.sort] ?? {},
				populate: "products.product",
				lean: true,
			};

			const cartsFound = await this.#cartModel.paginate({}, paginationOptions);

			return cartsFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};

	// Obtiene un carrito específico por su ID
	getOneById = async (id) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const cartFound = await this.#cartModel
				.findById(id)
				.populate("products.product")
				.lean();
			if (!cartFound) {
				throw new ErrorManager("ID no encontrado", 404);
			}
			return cartFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};

	// Crea un nuevo carrito
	insertOne = async (data) => {
		try {
			const cartCreated = new CartModel(data);
			await cartCreated.save();
			return cartCreated;
		} catch (error) {
			if (error instanceof mongoose.Error.ValidationError) {
				error.message = Object.values(error.errors)[0];
			}
			throw ErrorManager.handleError(error);
		}
	};

	// Actualiza un carrito por su ID
	updateOneById = async (id, data) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const cartFound = await this.#cartModel.findById(id);
			if (!cartFound) {
				throw new ErrorManager("ID no encontrado", 404);
			}
			cartFound.products = data.products;
			await cartFound.save();

			return cartFound;
		} catch (error) {
			if (error instanceof mongoose.Error.ValidationError) {
				error.message = Object.values(error.errors)[0];
			}

			throw new ErrorManager(error.message, error.code);
		}
	};

	// Elimina un carrito por su ID
	deleteOneById = async (id) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const cartFound = await this.#cartModel.findById(id);
			if (!cartFound) {
				throw new ErrorManager("ID no encontrado", 404);
			}

			await this.#cartModel.findByIdAndDelete(id);

			return cartFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};

	// Agrega un producto a un carrito
	addProductToCart = async (cartId, productId, quantity) => {
		try {
			if (!mongoDB.isValidID(cartId) || !mongoDB.isValidID(productId)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const cartFound = await this.#cartModel.findById(cartId);
			if (!cartFound) {
				throw new ErrorManager("ID de carrito no encontrado", 404);
			}

			const currentIndex = cartFound.products.findIndex(
				(product) => product.product.toString() === productId
			);
			if (currentIndex >= 0) {
				const product = cartFound.products[currentIndex];
				product.quantity += quantity;
				cartFound.products[currentIndex] = product;
			} else {
				cartFound.products.push({ product: productId, quantity });
			}
			await cartFound.save();
			return cartFound;
		} catch (error) {
			if (error instanceof mongoose.Error.ValidationError) {
				error.message = Object.values(error.errors)[0];
			}

			throw new ErrorManager(error.message);
		}
	};

	// Elimina un producto de un carrito
	deleteProductFromCart = async (id, productId, quantity) => {
		try {
			if (!mongoDB.isValidID(id) || !mongoDB.isValidID(productId)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const cartFound = await this.#cartModel.findById(id);
			if (!cartFound) {
				throw new ErrorManager("ID de carrito no encontrado", 404);
			}

			const currentIndex = cartFound.products.findIndex(
				(product) => product.product.toString() === productId
			);
			if (currentIndex < 0) {
				throw new ErrorManager(
					"ID de producto no encontrado en el carrito",
					404
				);
			}

			const product = cartFound.products[currentIndex];
			if (product.quantity > quantity) {
				product.quantity -= quantity;
				cartFound.products[currentIndex] = product;
			} else {
				cartFound.products.splice(currentIndex, 1);
			}

			await cartFound.save();
			return cartFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};

	// Elimina todos los productos de un carrito
	deleteAllProductsFromCart = async (id) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const cartFound = await this.#cartModel.findById(id);
			if (!cartFound) {
				throw new ErrorManager("ID de carrito no encontrado", 404);
			}

			cartFound.products = [];
			await cartFound.save();
			return cartFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};
}
