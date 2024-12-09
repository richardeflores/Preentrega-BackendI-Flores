import { connect, Types } from "mongoose";

export const connectDB = async () => {
	const URL =
		"mongodb+srv://lcdorichardflores:Prueba1234@cluster0.lp6jf.mongodb.net/backend1" ||
		"mongodb://localhost:27017/ProyectoFinal-BackEnd1-CoderHouse";

	try {
		await connect(URL);
		console.log("Conectado a MongoDB Atlas");
	} catch (error) {
		console.error("Error al intentar conectar a MongoDB Atlas: ", error);
	}
};

export const isValidID = (id) => {
	return Types.ObjectId.isValid(id);
};
