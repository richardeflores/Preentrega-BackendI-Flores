import ErrorManager from "./ErrorManager.js";
import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import FileHandler from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager {
	#productModel;
	#fileHandler;

	constructor() {
		this.#productModel = ProductModel;
		this.#fileHandler = new FileHandler();
	}

	getAll = async (params) => {
		try {
			const $and = [];

			if (params?.title)
				$and.push({ title: { $regex: params.title, $options: "i" } });
			if (params?.category) $and.push({ category: paramFilters.category });
			if (params?.availability)
				$and.push({ availability: convertToBoolean(params.availability) });
			const filters = $and.length > 0 ? { $and } : {};

			const sort = {
				asc: { title: 1 },
				desc: { title: -1 },
			};

			const paginationOptions = {
				limit: params?.limit ?? 4,
				page: params?.page ?? 1,
				sort: sort[params?.sort] ?? {},
				lean: true,
			};

			const productsFound = await this.#productModel.paginate(
				filters,
				paginationOptions
			);
			return productsFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};

	getOneById = async (id) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const productFound = await this.#productModel.findById(id).lean();

			if (!productFound) {
				throw new ErrorManager("ID no encontrado", 404);
			}

			return productFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};

	insertOne = async (data, filename) => {
		try {
			const productCreated = new ProductModel(data);
			productCreated.availability = convertToBoolean(data.availability);
			productCreated.thumbnail = filename ?? null;
			await productCreated.save();
			return productCreated;
		} catch (error) {
			if (filename) await this.#fileHandler.delete(paths.images, filename);

			if (error instanceof mongoose.Error.ValidationError) {
				error.message = Object.values(error.errors)[0];
			}

			throw new Error(error.message);
		}
	};

	updateOneById = async (id, data, filename) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const productFound = await this.#productModel.findById(id);
			const currentThumbnail = productFound.thumbnail;
			const newThumbnail = filename;

			if (!productFound) {
				throw new ErrorManager("ID no encontrado", 404);
			}

			productFound.title = data.tile;
			productFound.description = data.description;
			productFound.price = data.price;
			productFound.availability = convertToBoolean(data.availability);
			productFound.category = data.category;
			productFound.stock = data.stock;
			productFound.thumbnail = newThumbnail ?? currentThumbnail;
			await productFound.save();

			if (filename && newThumbnail != currentThumbnail) {
				await this.#fileHandler.delete(paths.images, currentThumbnail);
			}

			return productFound;
		} catch (error) {
			if (filename) await this.#fileHandler.delete(paths.images, filename);

			if (error instanceof mongoose.Error.ValidationError) {
				error.message = Object.values(error.errors)[0];
			}

			throw new Error(error.message);
		}
	};

	deleteOneById = async (id) => {
		try {
			if (!mongoDB.isValidID(id)) {
				throw new ErrorManager("ID inválido", 400);
			}

			const productFound = await this.#productModel.findById(id);
			if (!productFound) {
				throw new ErrorManager("ID no encontrado", 404);
			}

			await this.#productModel.findByIdAndDelete(id);
			await this.#fileHandler.delete(paths.images, productFound.thumbnail);

			return productFound;
		} catch (error) {
			throw ErrorManager.handleError(error);
		}
	};
}
