import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class cartManager {
	#jsonFilename;
	#cart;

	constructor() {
		this.#jsonFilename = "carrito.json";
	}

	// Busca un carrito por su ID
	async #findOneById(id) {
		this.#cart = await this.getAll();
		const cartFound = this.#cart.find((item) => item.id === Number(id));

		if (!cartFound) {
			throw new ErrorManager("ID no encontrado", 404);
		}

		return cartFound;
	}

	// Obtiene una lista de carritos
	async getAll() {
		try {
			this.#cart = await readJsonFile(paths.files, this.#jsonFilename);
			return this.#cart;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Obtiene un carrito específica por su ID
	async getOneById(id) {
		try {
			const cartFound = await this.#findOneById(id);
			return cartFound;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Inserta un carrito
	async insertOne(data) {
		try {
			const products = data?.products?.map((item) => {
				return { pcar: Number(item.product), quantity: 1 };
			});

			const cart = {
				id: generateId(await this.getAll()),
				products: products ?? [],
			};

			this.#cart.push(cart);
			await writeJsonFile(paths.files, this.#jsonFilename, this.#cart);

			return cart;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Agrega un producto a un carrito o incrementa la cantidad de unproducto existente
	addOneProduct = async (id, productId) => {
		try {
			const cartFound = await this.#findOneById(id);
			const productIndex = cartFound.products.findIndex(
				(item) => item.product === Number(productId)
			);

			if (productIndex >= 0) {
				cartFound.products[productIndex].quantity++;
			} else {
				cartFound.products.push({
					product: Number(productId),
					quantity: 1,
				});
			}

			const index = this.#cart.findIndex((item) => item.id === Number(id));
			this.#cart[index] = cartFound;
			await writeJsonFile(paths.files, this.#jsonFilename, this.#cart);

			return cartFound;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	};
}
