const socket = io();
const ingredientsTableRows = document.getElementById("ingredients-table-rows");
const ingredientsForm = document.getElementById("ingredients-form");
const inputIngredientId = document.getElementById("input-ingredient-id");
const btnDeleteIngredient = document.getElementById("btn-delete-ingredient");

/* ************************** EVENTOS ************************** */
ingredientsForm.onsubmit = async (event) => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const file = formData.get("file");

	if (file) {
		form.reset();

		socket.emit("insert-ingredient", {
			name: formData.get("name"),
			description: formData.get("description"),
			category: formData.get("category"),
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

btnDeleteIngredient.onclick = () => {
	const id = inputIngredientId.value;
	inputIngredientId.value = "";

	if (id) {
		socket.emit("delete-ingredient", { id });
	}
};

socket.on("ingredients-list", (data) => {
	const productsList = data.docs ?? [];
	ingredientsTableRows.innerText = "";

	productsList.forEach((ingredient) => {
		const trIngredient = `
            <td>${ingredient.id}</td>
            <td>${ingredient.name}</td>
        `;

		const tr = document.createElement("tr");
		tr.innerHTML = trIngredient;
		ingredientsTableRows.append(tr);
	});
});
// const socket = io();
// const productsList = document.getElementById("products-list");
// const productsForm = document.getElementById("products-form");
// const inputProductId = document.getElementById("input-product-id");
// const btnDeleteProduct = document.getElementById("btn-delete-product");
// const errorMessage = document.getElementById("error-message");

// socket.on("products-list", (data) => {
// 	const products = data.products.docs ?? [];
// 	productsList.innerHTML = "";

// 	products.forEach((product) => {
// 		const productItem = document.createElement("div");
// 		productItem.classList.add("card");
// 		productItem.innerHTML = `
//   			<img class="card-img-top" src="/api/public/images/${product.thumbnail}" alt="Card image cap">
//   		<div class="card-body">
//     		<h5 class="card-title">${product.title}</h5>
//     		<p class="card-text">${product.description}</p>
//   		</div>
// 		<ul class="list-group list-group-flush">
// 		<li class="list-group-item">Id: ${product.id}</li>
//     	<li class="list-group-item">Stock: ${product.stock}</li>
//     	<li class="list-group-item">Categoría: ${product.category}</li>
//     	<li class="list-group-item">Precio: ${product.price}</li>
// 		</ul>`;

// 		productsList.appendChild(productItem);
// 	});
// });

// productsForm.onsubmit = async (event) => {
// 	event.preventDefault();
// 	const form = event.target;
// 	const formData = new FormData(form);
// 	const file = formData.get("file");

// 	if (file) {
// 		form.reset();

// 		socket.emit("insert-product", {
// 			title: formData.get("title"),
// 			description: formData.get("description"),
// 			code: formData.get("code"),
// 			price: formData.get("price"),
// 			availability: formData.get("availability") || "off",
// 			stock: formData.get("stock"),
// 			category: formData.get("category"),
// 			thumbnail: formData.get("thumbnail"),
// 		});
// 	}
// };

// // productsForm.addEventListener("submit", async (event) => {
// // 	event.preventDefault();
// // 	const form = event.target;
// // 	const formdata = new FormData(form);

// // 	form.reset();

// // 	try {
// // 		const response = await fetch("/api/products", {
// // 			method: "POST",
// // 			body: formdata,
// // 		});
// // 		if (!response.ok) {
// // 			const error = await response.json();
// // 			console.log(`Error: ${error.message}`);
// // 			return;
// // 		}
// // 		console.log("Producto agregado con éxito.");
// // 		productsForm.reset();
// // 	} catch (error) {
// // 		console.error("Error al enviar el formulario:", error);
// // 	}
// // });

// btnDeleteProduct.onclick = () => {
// 	const id = inputProductId.value.trim();
// 	inputProductId.value = "";
// 	errorMessage.innerText = "";

// 	if (id) {
// 		socket.emit("delete-product", { id });
// 	} else {
// 		errorMessage.innerText = "Por favor ingrese un ID de producto válido.";
// 	}
// };

// socket.on("error-message", (data) => {
// 	errorMessage.innerText = data.message;
// });
