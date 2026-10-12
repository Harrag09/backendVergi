// ==========================================
// ROUTEUR DES COMMANDES (commandeRouter.js)
// ==========================================
const express = require("express");
const { createStoreOrder, getStoreOrders,getOrdersConsultation,createStore } = require("../controllers/commandeController");

const commandRouter = express.Router();

commandRouter.post("/commande/createStoreOrder", createStoreOrder);
commandRouter.get("/commande/getStoreOrders", getStoreOrders);
commandRouter.get("/commande/getOrdersConsultation", getOrdersConsultation);
commandRouter.post("/commande/createStore", createStore);
module.exports = commandRouter;
