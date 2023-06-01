const { Router } = require("express");
const categoriesRoutes = Router();

const CategoriesController = require("../controllers/CategoriesController");
const categoriesController = new CategoriesController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
categoriesRoutes.use(ensureAuthenticated);

categoriesRoutes.post("/", categoriesController.create);
categoriesRoutes.get("/", categoriesController.index);


module.exports = categoriesRoutes;