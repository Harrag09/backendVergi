const jwt = require("jsonwebtoken");
const { connectToDatabase, client: dbConfig } = require("../config/dbConfig.js");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');

dotenv.config();

const AjoutPalox = async (req, res) => {
  try {
    const data = { ...req.body };

    const newPalox = {
      barcode: data.barcode,
      supplierId: data.supplierId,
      productId: new ObjectId(data.productId),
      caliber: data.caliber,
      coldRoomId: new ObjectId(data.coldRoomId),
      location: data.location,
      size: data.size,
      fillLevel: data.fillLevel,
      status: data.status,
      dateAdded: data.dateAdded,
      weight: data.weight
    };

    const db = await connectToDatabase();
    const paloxCollection = db.collection("palox");
    const historyCollection = db.collection("history");

    const response = await paloxCollection.insertOne(newPalox);
    
    // CORRECTION APPORTÉE ICI
    const result = await paloxCollection.findOne({ _id: response.insertedId });

    const his = {
      action: "ENTRÉE",
      barcode: data.barcode,
      desc: `Réceptionné dans ${data.roomname} [${data.location}]`,
      userId: new ObjectId(data.userId),
      timestamp: new Date()
    };

    await historyCollection.insertOne(his);

    return res.status(201).json({
      success: true,
      data: result,
      history: his
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const MovePalox = async (req, res) => {
  try {
    const { paloxId, targetRoomId, targetLocation, userId, roomname } = req.body;
    const db = await connectToDatabase();
    
    const filter = { _id: new ObjectId(paloxId) };
    const updateDoc = {
      $set: {
        coldRoomId: new ObjectId(targetRoomId),
        location: targetLocation
      }
    };

    await db.collection("palox").updateOne(filter, updateDoc);
    const updatedPalox = await db.collection("palox").findOne(filter);

    const his = {
      action: "TRANSFERT",
      barcode: updatedPalox.barcode,
      desc: `Déplacé vers ${roomname} [${targetLocation}]`,
      userId: userId ? new ObjectId(userId) : null,
      timestamp: new Date()
    };

    await db.collection("history").insertOne(his);

    return res.status(200).json({ success: true, data: updatedPalox, history: his });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const UpdatePaloxStatus = async (req, res) => {
  try {
    const { paloxId, status } = req.body;
    const db = await connectToDatabase();
    
    await db.collection("palox").updateOne(
      { _id: new ObjectId(paloxId) },
      { $set: { status: status } }
    );
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const SortiePalox = async (req, res) => {
  try {
    const { paloxId, isDefinitive, fillLevel, weight, coldRoomId, location, userId, actionDesc } = req.body;
    const db = await connectToDatabase();
    const paloxCollection = db.collection("palox");
    const historyCollection = db.collection("history");

    const targetPalox = await paloxCollection.findOne({ _id: new ObjectId(paloxId) });
    if (!targetPalox) return res.status(404).json({ success: false, msg: "Palox introuvable" });

    let updatedPalox = null;

    if (isDefinitive) {
      await paloxCollection.updateOne(
        { _id: new ObjectId(paloxId) },
        { $set: { status: "EXITED", fillLevel: "Vide", weight: 0 } }
      );
      updatedPalox = { _id: paloxId, status: "EXITED" };
    } else {
      await paloxCollection.updateOne(
        { _id: new ObjectId(paloxId) },
        { $set: { status: "STORED", fillLevel, weight, coldRoomId: new ObjectId(coldRoomId), location } }
      );
      updatedPalox = await paloxCollection.findOne({ _id: new ObjectId(paloxId) });
    }

    const his = {
      action: isDefinitive ? "VIDÉ" : "RETOUR",
      barcode: targetPalox.barcode,
      desc: actionDesc,
      userId: userId ? new ObjectId(userId) : null,
      timestamp: new Date()
    };
    
    await historyCollection.insertOne(his);

    return res.status(200).json({ success: true, data: updatedPalox, history: his });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPaloxAndAllProductAndCOLD_ROOMS = async (req, res) => {
  try {
    const db = await connectToDatabase();
    
    const [coldRoom, history, magasin, palox, product, fournisseurs] = await Promise.all([
      db.collection("cold_rooms").find().toArray(),
      db.collection("history").find().sort({ timestamp: -1 }).toArray(), // On trie l'historique du plus récent au plus ancien
      db.collection("magasin").find().toArray(),
      db.collection("palox").find({ status: { $ne: "EXITED" } }).toArray(), // On évite de récupérer les palox sortis
      db.collection("product").find().toArray(),
      db.collection("fournisseurs").find().toArray()
    ]);

    return res.status(200).json({
      msg: "Données trouvées.",
      success: true,
      data: { coldRoom, history, magasin, palox, product, fournisseurs }
    });

  } catch (err) {
    console.error("Erreur de récupération :", err);
    return res.status(500).json({ msg: err.message, success: false });
  }
};

module.exports = { 
  getAllPaloxAndAllProductAndCOLD_ROOMS, 
  AjoutPalox, 
  MovePalox, 
  UpdatePaloxStatus, 
  SortiePalox 
};