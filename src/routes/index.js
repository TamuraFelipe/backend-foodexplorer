const { Router } = require("express");

const usersRouter = require("./users.routes");
const categoriesRouter = require("./categories.routes");
const dishesRouter = require("./dishes.routes");
const ingredientsRouter = require("./ingredients.routes");
const sessionsRouter = require("./sessions.routes");
const ordersRouter = require("./orders.routes.js");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/categories", categoriesRouter);
routes.use("/dishes", dishesRouter);
routes.use("/ingredients", ingredientsRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/orders", ordersRouter);

module.exports = routes;
