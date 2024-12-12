import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";

export default class cartManager {
	#cartModel;

	constructor() {
		this.#cartModel = CartModel;
	}

	// Busca un carrito por su ID
	async #findOneById(id) {
		if (!isValidID(id)) {
			throw new ErrorManager("ID inválido", 400);
		}

		const cart = await this.#cartModel.findById(id).populate("carts.cart");

		if (!cart) {
			throw new ErrorManager("ID no encontrado", 404);
		}

		return cart;
	}

	// Obtiene una lista de carritos
	async getAll(params) {
		try {
			const paginationOptions = {
				limit: params?.limit || 10,
				page: params?.page || 1,
				populate: "carts.cart",
				lean: true,
			};

			return await this.#cartModel.paginate({}, paginationOptions);
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	}

	// Obtiene un carrito específica por su ID
	async getOneById(id) {
		try {
			return await this.#findOneById(id);
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	}

	// Inserta un carrito
	async insertOne(data) {
		try {
			const cart = await this.#cartModel.create(data);
			return cart;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	}

	// Agrega un producto a un carrito o incrementa la cantidad de unproducto existente
	addOneProduct = async (id, productId) => {
		try {
			const cart = await this.#findOneById(id);
			const productIndex = cart.products.findIndex(
				(item) => item.product._id.toString() === productId
			);

			if (productIndex >= 0) {
				cart.products[productIndex].quantity++;
			} else {
				cart.products.push({ product: productId, quantity: 1 });
			}

			await cart.save();

			return cart;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	};
}
