const express = require("express");
const usersController = require("../controllers/usersController.js");

const { getuser } = usersController;

const usersRoutes = express.Router();

usersRoutes.get("/register", getuser);

module.exports = usersRoutes;