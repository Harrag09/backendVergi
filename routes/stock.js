const express = require("express");
const stockController = require("../controllers/stockController.js");

const { 
  getAllPaloxAndAllProductAndCOLD_ROOMS, 
  AjoutPalox,
  MovePalox,
  UpdatePaloxStatus,
  SortiePalox,
  getStatisticsData
} = stockController;

const stockRoutes = express.Router();

stockRoutes.get("/stock/getAllPaloxAndAllProductAndCOLD_ROOMS", getAllPaloxAndAllProductAndCOLD_ROOMS);
stockRoutes.post("/stock/AjoutPalox", AjoutPalox);
stockRoutes.post("/stock/MovePalox", MovePalox);
stockRoutes.post("/stock/UpdatePaloxStatus", UpdatePaloxStatus);
stockRoutes.post("/stock/SortiePalox", SortiePalox);
stockRoutes.get("/stock/statistics", getStatisticsData);

module.exports = stockRoutes;