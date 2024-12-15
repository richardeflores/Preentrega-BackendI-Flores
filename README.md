
# Preentrega-BackendI-Flores

Este proyecto es la primera entrega de un backend desarrollado en Node.js, proporcionando varias funcionalidades a través de una API.

## Pasos para ejecutar el proyecto

1. **Clonar el repositorio**

   Para comenzar, primero clona el repositorio en tu máquina local. Abre tu terminal y ejecuta el siguiente comando:

   ```bash
   git clone https://github.com/richardeflores/Preentrega-BackendI-Flores.git
   ```

2. **Instalar las dependencias**

   Una vez que hayas clonado el repositorio, navega al directorio del proyecto:

   ```bash
   cd Preentrega-BackendI-Flores
   ```

   Luego, instala las dependencias necesarias utilizando `npm`:

   ```bash
   npm install
   ```

3. **Ejecutar el proyecto**

   Ahora, puedes ejecutar el proyecto en modo de desarrollo con el siguiente comando:

   ```bash
   npm run dev
   ```

   Este comando iniciará el servidor y lo ejecutará en el entorno de desarrollo. El servidor debería estar accesible en `http://localhost:3000` (o el puerto que esté configurado).

## Tecnologías usadas

El proyecto utiliza las siguientes dependencias:

- **dotenv**: ^16.4.7 — Carga variables de entorno desde un archivo `.env`.
- **express**: ^4.21.1 — Framework web para Node.js.
- **express-handlebars**: ^8.0.1 — Motor de plantillas para Express.
- **moment**: ^2.30.1 — Librería para manejar fechas y horas.
- **mongoose**: ^8.8.4 — Librería para trabajar con MongoDB.
- **mongoose-aggregate-paginate-v2**: ^1.1.2 — Paginación avanzada para agregados en MongoDB.
- **mongoose-paginate-v2**: ^1.8.5 — Paginación de resultados en MongoDB.
- **multer**: ^1.4.5-lts.1 — Middleware para manejar `multipart/form-data`, usado para cargar archivos.
- **socket.io**: ^4.8.1 — Biblioteca para manejar comunicaciones en tiempo real con WebSockets.

## Notas

- Asegúrate de tener **Node.js** y **npm** instalados en tu máquina antes de ejecutar los pasos anteriores. Si no los tienes, puedes descargarlos desde [nodejs.org](https://nodejs.org/).
- Si el proyecto utiliza una base de datos como **MongoDB**, asegúrate de que tu instancia de MongoDB esté corriendo y configurada correctamente en el archivo `.env` (si es necesario).
- Este proyecto utiliza **Socket.IO** para comunicaciones en tiempo real, por lo que asegúrate de que tu servidor está configurado correctamente para WebSockets.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
