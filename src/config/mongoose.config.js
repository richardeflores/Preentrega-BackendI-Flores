import { connect, Types } from "mongoose";

export const connectDB = async () => {
	const URL = process.env.MONGO_URI;
	try {
		await connect(URL);
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
