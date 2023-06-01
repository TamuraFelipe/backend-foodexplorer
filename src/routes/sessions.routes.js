const { Router } = require("express");
const sessionsRoutes = Router();

const SessionsController = require("../controllers/SessionController");
const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create)

module.exports = sessionsRoutes;