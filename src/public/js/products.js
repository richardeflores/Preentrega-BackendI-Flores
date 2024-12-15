const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

const addProduct = async (cartId, currentProductId) => {
	const options = {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ quantity: 1 }),
	};

	await fetch(`/api/carts/${cartId}/products/${currentProductId}`, options);
};

const removeProduct = async (cartId, currentCartId) => {
	await fetch(`/api/carts/${cartId}/products/${currentCartId}`, {
		method: "DELETE",
	});
};

const removeAllProducts = async (cartId) => {
	await fetch(`/api/carts/${cartId}/products`, {
		method: "DELETE",
	});
};
