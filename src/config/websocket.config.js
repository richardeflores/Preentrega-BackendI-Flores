import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";
import FileHandler from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateNameForFile } from "../utils/random.js";

const productManager = new ProductManager();
const fileHandler = new FileHandler();
let socketServer = null;

const config = (httpServer) => {
	const socketServer = new Server(httpServer, {
		maxHttpBufferSize: 5e6,
	});

	socketServer.on("connection", async (socket) => {
		const response = await productManager.getAll({ limit: 100 });
		console.log("Socket connected");

		socketServer.emit("products-list", response);

		socket.on("insert-product", async (data) => {
			if (data?.file) {
				const filename = generateNameForFile(data.file.name);
				await fileHandler.write(paths.images, filename, data.file.buffer);

				await productManager.insertOne(data, filename);
				const response = await productManager.getAll({ limit: 100 });

				socketServer.emit("products-list", response);
			}
		});

		socket.on("delete-product", async (data) => {
			await productManager.deleteOneById(data.id);
			const response = await productManager.getAll({ limit: 100 });

			socketServer.emit("products-list", response);
		});
	});
};

export const updateProductsList = async () => {
	const response = await productManager.getAll({ limit: 100 });

	// Envía la lista de ingredientes actualizada
	socketServer.emit("products-list", { response });
};

export default {
	config,
	updateProductsList,
};
