const express = require("express");
const userController = require("../controllers/usersController.js")

const { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  loginUser
} = userController;

const userRoutes = express.Router();

userRoutes.get("/users/getAllUsers", getAllUsers);
userRoutes.post("/users/createUser", createUser);
userRoutes.put("/users/updateUser/:userId", updateUser); // ou .put("/users/updateUser", updateUser)
userRoutes.delete("/users/deleteUser/:userId", deleteUser);
userRoutes.post("/users/login", loginUser); // <--- Nouvelle route de connexion
module.exports = userRoutes;