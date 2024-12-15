const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

const addProduct = async (cartId, currentCartId) => {
	const options = {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ amount: 1 }),
	};

	await fetch(`/api/carts/${cartId}/products/${currentCartId}`, options);
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

const createProduct = async (data) => {
	await fetch("/api/products", {
		method: "POST",
		body: data,
	});

	window.location.reload();
};

const deleteProduct = async (id) => {
	await fetch(`/api/products/${id}`, { method: "DELETE" });
	window.location.reload();
};

if (productsForm) {
	productsForm.onsubmit = (event) => {
		event.preventDefault();

		const form = event.target;
		const formData = new FormData(form);

		form.reset();

		createProduct(formData);
	};
}

if (btnDeleteProduct) {
	btnDeleteProduct.onclick = () => {
		const id = inputProductId.value;
		inputProductId.value = "";

		if (id) {
			deleteProduct(id);
		}
	};
}
