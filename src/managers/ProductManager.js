import paths from "../utils/paths.js";
import {
	readJsonFile,
	writeJsonFile,
	deleteFile,
} from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager {
	#jsonFilename;
	#products;

	constructor() {
		this.#jsonFilename = "productos.json";
	}

	// Búsqueda por ID
	async #findOneById(id) {
		this.#products = await this.getAll();
		const productFound = this.#products.find((item) => item.id === Number(id));

		if (!productFound) {
			throw new ErrorManager("ID no encontrado", 404);
		}

		return productFound;
	}

	// Lista completa
	async getAll() {
		try {
			this.#products = await readJsonFile(paths.files, this.#jsonFilename);
			return this.#products;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Obtiene un producto específico por su ID
	async getOneById(id) {
		try {
			const productFound = await this.#findOneById(id);
			return productFound;
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Inserta un producto
	async insertOne(data, file) {
		try {
			const { title, description, code, price, status, stock, category } = data;

			if (
				!title ||
				!description ||
				!code ||
				!price ||
				!status ||
				!stock ||
				!category
			) {
				throw new ErrorManager("Faltan datos obligatorios", 400);
			}

			const product = {
				id: generateId(await this.getAll()),
				title,
				description,
				code,
				price: Number(price),
				status: convertToBoolean(status),
				stock: Number(stock),
				category,
				thumbnail: file?.filename || "Imagen no disponible",
			};

			this.#products.push(product);
			await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

			return product;
		} catch (error) {
			if (file?.filename) await deleteFile(paths.images, file.filename); // Elimina la imagen si ocurre un error
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Actualiza un producto en específico
	async updateOneById(id, data, file) {
		try {
			const { title, description, code, price, status, stock, category } = data;
			const productFound = await this.#findOneById(id);
			const newThumbnail = file?.filename;

			const product = {
				id: productFound.id,
				title: title || productFound.title,
				description: description || productFound.description,
				code: code || productFound.code,
				price: price ? Number(price) : productFound.price,
				status: status ? convertToBoolean(status) : productFound.status,
				stock: stock ? Number(stock) : productFound.stock,
				category: category || productFound.category,
				thumbnail: newThumbnail || productFound.thumbnail,
			};

			const index = this.#products.findIndex((item) => item.id === Number(id));
			this.#products[index] = product;
			await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

			// Elimina la imagen anterior si es distinta de la nueva
			if (file?.filename && newThumbnail !== productFound.thumbnail) {
				await deleteFile(paths.images, productFound.thumbnail);
			}

			return product;
		} catch (error) {
			if (file?.filename) await deleteFile(paths.images, file.filename); // Elimina la imagen si ocurre un error
			throw new ErrorManager(error.message, error.code);
		}
	}

	// Elimina un producto en específico
	async deleteOneById(id) {
		try {
			const productFound = await this.#findOneById(id);

			// Si tiene thumbnail definido, entonces, elimina la imagen del producto
			if (productFound.thumbnail) {
				await deleteFile(paths.images, productFound.thumbnail);
			}

			const index = this.#products.findIndex((item) => item.id === Number(id));
			this.#products.splice(index, 1);
			await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
		} catch (error) {
			throw new ErrorManager(error.message, error.code);
		}
	}
}
