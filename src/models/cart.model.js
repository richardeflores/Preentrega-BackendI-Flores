import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema(
	{
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "products",
				},
				quantity: {
					type: Number,
					required: true,
					min: [1, "La cantidad debe ser un valor positivo"],
				},
			},
		],
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

cartSchema.plugin(paginate);

const CartModel = model("carts", cartSchema);

export default CartModel;
