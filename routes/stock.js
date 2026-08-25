const express = require("express");
const stockController = require("../controllers/stockController.js");

const { 
  getAllPaloxAndAllProductAndCOLD_ROOMS, 
  AjoutPalox,
  MovePalox,
  UpdatePaloxStatus,
  SortiePalox,
  getStatisticsData,
  CreateCommand
} = stockController;

const stockRoutes = express.Router();

stockRoutes.get("/stock/getAllPaloxAndAllProductAndCOLD_ROOMS", getAllPaloxAndAllProductAndCOLD_ROOMS);
stockRoutes.post("/stock/AjoutPalox", AjoutPalox);
stockRoutes.post("/stock/MovePalox", MovePalox);
stockRoutes.post("/stock/UpdatePaloxStatus", UpdatePaloxStatus);
stockRoutes.post("/stock/SortiePalox", SortiePalox);
stockRoutes.get("/stock/statistics", getStatisticsData);
stockRoutes.post("/stock/CreateCommand", CreateCommand);


module.exports = stockRoutes;