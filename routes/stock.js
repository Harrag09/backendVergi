const express = require("express");
const stockController = require("../controllers/stockController.js");
const { verifyAccessToken } = require("../utils/verifyToken.js");

const { 
  getAllPaloxAndAllProductAndCOLD_ROOMS, 
  AjoutPalox,
  MovePalox,
  UpdatePaloxStatus,
  SortiePalox,
  getStatisticsData,
  CreateCommand,
  getStockData,
  getOperationalAlerts,
  recordTelemetryReading
} = stockController;

const stockRoutes = express.Router();
stockRoutes.use(verifyAccessToken);

stockRoutes.get("/stock/getAllPaloxAndAllProductAndCOLD_ROOMS", getAllPaloxAndAllProductAndCOLD_ROOMS);
stockRoutes.get("/stock/getStockData", getStockData);
stockRoutes.get("/stock/alerts", getOperationalAlerts);
stockRoutes.post("/stock/telemetry/readings", recordTelemetryReading);
stockRoutes.post("/stock/AjoutPalox", AjoutPalox);
stockRoutes.post("/stock/MovePalox", MovePalox);
stockRoutes.post("/stock/UpdatePaloxStatus", UpdatePaloxStatus);
stockRoutes.post("/stock/SortiePalox", SortiePalox);
stockRoutes.get("/stock/statistics", getStatisticsData);
stockRoutes.post("/stock/CreateCommand", CreateCommand);


module.exports = stockRoutes;