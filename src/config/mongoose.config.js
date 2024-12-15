import { connect, Types } from "mongoose";
import { MONGO_URI } from "./config.js";

export const connectDB = async () => {
	const URI = MONGO_URI;

	try {
		await connect(URI);
		console.log("Conectado con Base de Datos MongoDB ");
	} catch (error) {
		console.error(
			"Error al conectar con la base de datos Mongo mediante Mongoose",
			error.message
		);
	}
};

export const isValidID = (id) => {
	return Types.ObjectId.isValid(id);
};

export default {
	connectDB,
	isValidID,
};
