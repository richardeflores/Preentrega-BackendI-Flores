import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema(
	{
		title: {
			index: { name: "idx_title" },
			type: String,
			required: [true, "El nombre es obligatorio"],
			uppercase: true,
			trim: true,
			minLength: [3, "El nombre debe tener al menos 3 caracteres"],
			maxLength: [25, "El nombre debe tener como máximo 25 caracteres"],
		},
		description: {
			type: String,
			required: [true, "La Categoría es obligatoria"],
			uppercase: true,
			maxLength: [250, "La descripción debe tener como máximo 250 caracteres"],
		},
		category: {
			type: String,
			required: [true, "La Categoría es obligatoria"],
			uppercase: true,
			trim: true,
			minLength: [3, "La categoría debe tener al menos 3 caracteres"],
			maxLength: [10, "La categoría debe tener como máximo 10 caracteres"],
		},
		stock: {
			type: Number,
			required: [true, "El stock es obligatorio"],
			min: [0, "El stock debe ser un valor positivo"],
		},
		price: {
			type: Number,
			required: [true, "El stock es obligatorio"],
			min: [0, "El stock debe ser un valor positivo"],
		},
		availability: {
			type: Boolean,
			required: [true, "La disponibilidad es obligatoria"],
		},
		thumbnail: {
			type: String,
			trim: true,
		},
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

productSchema.pre("save", function (next) {
	if (!this.thumbnail) {
		this.thumbnail = "ImagenUnavailable.jpg";
	}
	next();
});

productSchema.pre("findByIdAndDelete", async function (next) {
	const CartModel = this.model("carts");

	await CartModel.updateMany(
		{ "products.product": this._id },
		{ $pull: { products: { product: this._id } } }
	);

	next();
});

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;
