import handlebars from "express-handlebars";
import paths from "../utils/paths.js";

export const config = (server) => {
	server.engine("handlebars", handlebars.engine());
	server.set("views", paths.views);
	server.set("view engine", "handlebars");
};
