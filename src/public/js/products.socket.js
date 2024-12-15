const socket = io();

const productsContainer = document.getElementById("products-container");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

productsForm.onsubmit = async (event) => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const file = formData.get("file");

	if (file) {
		form.reset();

		socket.emit("insert-product", {
			title: formData.get("title"),
			description: formData.get("description"),
			category: formData.get("category"),
			price: formData.get("price"),
			stock: formData.get("stock"),
			availability: Boolean(formData.get("availability")),
			file: {
				name: file.name,
				type: file.type,
				size: file.size,
				buffer: file,
			},
		});
	}
};

btnDeleteProduct.onclick = () => {
	const id = inputProductId.value;
	inputProductId.value = "";

	if (id) {
		socket.emit("delete-product", { id });
	}
};

socket.on("products-list", (data) => {
	const productsList = data.docs ?? [];
	productsContainer.innerText = "";

	productsList.forEach((product) => {
		const productItem = `
				  <img class="card-img-top" src="/public/images/${product.thumbnail}" alt="Card image cap">
			  <div class="card-body">
				<h5 class="card-title">${product.title}</h5>
				<p class="card-text">${product.description}</p>
			  </div>
			<ul class="list-group list-group-flush">
			<li class="list-group-item">Id: ${product.id}</li>
			<li class="list-group-item">Stock: ${product.stock}</li>
			<li class="list-group-item">Categoría: ${product.category}</li>
			<li class="list-group-item">Precio: ${product.price}</li>
			</ul>`;

		const productDiv = document.createElement("div");
		productDiv.classList.add("card");
		productDiv.innerHTML = productItem;
		productsContainer.append(productDiv);
	});
});
