const { Router } = require("express");
const dishesRoutes = Router();
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");

const dishesController = new DishesController();

const upload = multer(uploadConfig.MULTER);

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", upload.single("image"), dishesController.create)
dishesRoutes.put("/:dishes_id", upload.single("image"), dishesController.update)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.delete("/:id", dishesController.delete)

module.exports = dishesRoutes;

