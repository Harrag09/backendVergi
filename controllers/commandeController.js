// ==========================================
// CONTÔLEUR DES COMMANDES MAGASINS (commandeController.js)
// ==========================================
const { connectToDatabase } = require("../config/dbConfig.js");
const { ObjectId } = require('mongodb');

const createStoreOrder = async (req, res) => {
  try {
    const { magasinId, items, userId } = req.body;
    const db = await connectToDatabase();
    
    // 1. Récupérer le magasin depuis la collection "magasin"
    const magasin = await db.collection("magasin").findOne({ _id: new ObjectId(magasinId) });
    if (!magasin) {
      return res.status(404).json({ success: false, error: "Magasin introuvable" });
    }

    // 2. Valider et structurer les articles avec la collection "product"
    const formattedItems = await Promise.all(items.map(async (item) => {
      const product = await db.collection("product").findOne({ _id: new ObjectId(item.productId) });
      return {
        productId: new ObjectId(item.productId),
        productName: product ? product.name : "Inconnu",
        productIcon: product ? product.icon : "📦",
        quantity: item.quantity,
        packaging: item.packaging // ex: "CAISSE", "SAC"
      };
    }));

    const newCommand = {
      magasinId: new ObjectId(magasinId),
      magasinName: magasin.name,
      caisse: magasin.caisse, // Ex: "gris"
      items: formattedItems,
      status: "EN_COURS",
      createdAt: new Date(),
      userId: userId ? new ObjectId(userId) : null
    };

    const result = await db.collection("commandes_magasin").insertOne(newCommand);
    const savedCommand = await db.collection("commandes_magasin").findOne({ _id: result.insertedId });

    // 3. Ajouter une trace dans l'historique
    const his = {
      action: "COMMANDE",
      barcode: `CMD-${Math.floor(1000 + Math.random() * 9000)}`,
      desc: `Commande pour ${magasin.name} (Caisse: ${magasin.caisse}) - ${items.length} article(s)`,
      userId: userId ? new ObjectId(userId) : null,
      timestamp: new Date()
    };
    await db.collection("history").insertOne(his);

    return res.status(201).json({
      success: true,
      data: savedCommand,
      history: his,
      msg: "Commande enregistrée avec succès."
    });
  } catch (error) {
    console.error("Erreur createStoreOrder:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getStoreOrders = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const orders = await db.collection("commandes_magasin").find().sort({ createdAt: -1 }).toArray();
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Erreur getStoreOrders:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersConsultation = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [magasins, products, orders] = await Promise.all([
      db.collection("magasin").find().toArray(),
      db.collection("product").find().toArray(),
      db.collection("commandes_magasin").find().toArray()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        magasins,
        products,
        orders
      }
    });
  } catch (error) {
    console.error("Erreur getOrdersConsultation:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const createStore = async (req, res) => {
  try {
    const { name, caisse } = req.body;
    const db = await connectToDatabase();
    const magasinCollection = db.collection("magasin");

    const newMagasin = {
      name: name || "Nouveau Magasin",
      caisse: caisse || "Standard",
      createdAt: new Date()
    };

    const result = await magasinCollection.insertOne(newMagasin);
    const savedMagasin = await magasinCollection.findOne({ _id: result.insertedId });

    return res.status(201).json({
      success: true,
      data: savedMagasin,
      msg: "Magasin créé avec succès."
    });
  } catch (error) {
    console.error("Erreur createStore:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  createStoreOrder,
  getStoreOrders,
  getOrdersConsultation,
  createStore
};