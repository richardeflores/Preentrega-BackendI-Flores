import { connect, Types } from "mongoose";

export const connectDB = async () => {
	try {
		await connect(process.env.MONGO_URI);
		console.log("Conectado con Base de Datos MongoDB ");
	} catch (error) {
		console.error(
			"Error al conectar con la base de datos Mongo mediante Mongoose",
			error
		);
		throw new Error(error);
	}
};

export const isValidID = (id) => {
	return Types.ObjectId.isValid(id);
};
