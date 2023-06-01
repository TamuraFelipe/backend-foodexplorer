const { Router } = require("express");

const ingredientsRoutes = Router();

const IngredientsController = require("../controllers/IngredientsController");
const ingredientsController = new IngredientsController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
ingredientsRoutes.use(ensureAuthenticated);

ingredientsRoutes.post("/:dishes_id", ingredientsController.create)
ingredientsRoutes.delete("/:id", ingredientsController.delete)

module.exports = ingredientsRoutes;

