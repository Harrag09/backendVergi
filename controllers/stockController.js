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
      weight: data.weight,
      // ASSOCIATE PALOX TO COMMAND
      commandId: data.commandId ? new ObjectId(data.commandId) : null
    };

    const db = await connectToDatabase();
    const paloxCollection = db.collection("palox");
    const historyCollection = db.collection("history");

    const response = await paloxCollection.insertOne(newPalox);
    const result = await paloxCollection.findOne({ _id: response.insertedId });

    const his = {
      action: "ENTRÉE",
      barcode: data.barcode,
      desc: `Réceptionné dans ${data.roomname} [${data.location}] (Commande: ${data.commandCode || 'N/A'})`,
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
    
    const [coldRoom, history, magasin, palox, product, fournisseurs, commandes] = await Promise.all([
      db.collection("cold_rooms").find().toArray(),
      db.collection("history").find().sort({ timestamp: -1 }).toArray(),
      db.collection("magasin").find().toArray(),
      db.collection("palox").find({ status: { $ne: "EXITED" } }).toArray(),
      db.collection("product").find().toArray(),
      db.collection("fournisseurs").find().toArray(),
      db.collection("commandes").find({ status: "OPEN" }).toArray() // FETCH OPEN COMMANDS
    ]);

    return res.status(200).json({
      msg: "Données trouvées.",
      success: true,
      data: { coldRoom, history, magasin, palox, product, fournisseurs, commandes }
    });

  } catch (err) {
    console.error("Erreur de récupération :", err);
    return res.status(500).json({ msg: err.message, success: false });
  }
};


const getStatisticsData = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    const db = await connectToDatabase();
    
    // 1. Pipeline Aggregation MongoDB : Jointure des collections 'product' et 'cold_rooms'
    const pipeline = [
      { $match: { status: "STORED" } },
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "cold_rooms",
          localField: "coldRoomId",
          foreignField: "_id",
          as: "roomDetails"
        }
      },
      { $unwind: { path: "$roomDetails", preserveNullAndEmptyArrays: true } }
    ];

    // Exécution de l'agrégation
    let paloxList = await db.collection("palox").aggregate(pipeline).toArray();

    // 2. Filtre par terme de recherche (search query)
    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      paloxList = paloxList.filter(p => 
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.productDetails && p.productDetails.name && p.productDetails.name.toLowerCase().includes(q)) ||
        (p.roomDetails && p.roomDetails.name && p.roomDetails.name.toLowerCase().includes(q)) ||
        (p._id && String(p._id).toLowerCase().includes(q))
      );
    }

    // 3. Filtre par plage de dates
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date("2000-01-01");
      const end = endDate ? new Date(endDate) : new Date("2100-01-01");
      end.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
      
      paloxList = paloxList.filter(p => {
        let dateObj;
        // Gestion des formats de date (ex: "Le 15/07/2026 - à 10:00" ou ISO Date)
        if (p.dateAdded && typeof p.dateAdded === 'string' && p.dateAdded.includes("Le")) {
          const parts = p.dateAdded.split(" ")[1].split("/");
          dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          dateObj = new Date(p.dateAdded || (p._id ? p._id.getTimestamp() : Date.now()));
        }
          
        return dateObj >= start && dateObj <= end;
      });
    }

    // 4. Calculs des Métriques & Données de Graphique (KPIs)
    const totalCount = paloxList.length;
    const totalWeight = paloxList.reduce((sum, p) => sum + (Number(p.weight) || 0), 0);
    
    // Groupement par variété / produit pour le Camembert (Pie Chart)
    const productsMap = {};
    paloxList.forEach(p => {
      const name = p.productDetails?.name || "Inconnu";
      if (!productsMap[name]) {
        productsMap[name] = { 
          name, 
          value: 0, 
          color: p.productDetails?.color || "#CBD5E1" 
        };
      }
      productsMap[name].value += (Number(p.weight) || 0);
    });

    // Récupération de la liste complète des chambres froides pour la section IoT
    const rooms = await db.collection("cold_rooms").find().toArray();

    // 5. Réponse JSON structurée
    return res.status(200).json({
      success: true,
      data: {
        palox: paloxList,
        rooms: rooms,
        stats: {
          count: totalCount,
          weight: totalWeight,
          avgAge: 12, // Durée moyenne de stockage estimée
          products: Object.values(productsMap),
          trend: [
            { name: "Lun", value: Math.round(totalWeight * 0.70) },
            { name: "Mar", value: Math.round(totalWeight * 0.78) },
            { name: "Mer", value: Math.round(totalWeight * 0.86) },
            { name: "Jeu", value: Math.round(totalWeight * 0.90) },
            { name: "Ven", value: Math.round(totalWeight * 0.94) },
            { name: "Aujourd'hui", value: totalWeight }
          ]
        }
      }
    });

  } catch (error) {
    console.error("Erreur getStatisticsData :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const CreateCommand = async (req, res) => {
  try {
    const { code, supplierId } = req.body;
    const db = await connectToDatabase();
    const commandCollection = db.collection("commandes");

    const newCommand = {
      code: code || `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: supplierId || "SUP-01",
      status: "OPEN",
      createdAt: new Date()
    };

    const response = await commandCollection.insertOne(newCommand);
    const result = await commandCollection.findOne({ _id: response.insertedId });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Erreur CreateCommand :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  CreateCommand,
  getAllPaloxAndAllProductAndCOLD_ROOMS, 
  AjoutPalox, 
  MovePalox, 
  UpdatePaloxStatus, 
  SortiePalox ,
  getStatisticsData
};