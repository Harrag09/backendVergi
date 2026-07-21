const express = require("express");
const authController = require("../controllers/authController.js");
const verifyToken = require("../utils/verifyToken.js");

const { getAllUsers, getUserById, signin, signup,deleteIdUser,modifyUser,getUserByIDcrm } = authController;
const { verifyAccessToken } = verifyToken;

const authRoutes = express.Router();

authRoutes.post("/auth/signin", signin);
authRoutes.post("/auth/signup", signup);
authRoutes.get("/auth/all", getAllUsers);
authRoutes.delete("/auth/deleteUser/:id", deleteIdUser);
authRoutes.put("/auth/modifyUser/:id", modifyUser);
// authRoutes.delete("/auth/delete", deleteUser);
const signout = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("loggedIn");
  res.clearCookie("idUser");
  res.clearCookie("idCRM");

  return res.status(200).json({
    msg: "Logout successful.",
    success: true,
  });
};
authRoutes.post("/auth/logout", signout);
authRoutes.get("/auth/user",  getUserById); 
authRoutes.get("/auth/getUserByIdcrm/:idCRM",  getUserByIDcrm); 
// New route for getting user by ID

module.exports = authRoutes; // Updated line to use module.exports
