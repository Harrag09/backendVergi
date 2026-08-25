const jwt = require("jsonwebtoken");
const { connectToDatabase, client: dbConfig } = require("../config/dbConfig.js");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

dotenv.config();

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();

    return res.status(200).json({
      msg: "Utilisateurs trouvés avec succès.",
      success: true,
      data: users
    });
  } catch (err) {
    console.error("Erreur de récupération des utilisateurs :", err);
    return res.status(500).json({ msg: err.message, success: false });
  }
};

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { login, password, firstName, lastName, role } = req.body;

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Ce login est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      login,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "autre",
      createdAt: new Date()
    };

    const response = await usersCollection.insertOne(newUser);
    const createdUser = await usersCollection.findOne(
      { _id: response.insertedId },
      { projection: { password: 0 } }
    );

    return res.status(201).json({
      success: true,
      msg: "Utilisateur créé avec succès.",
      data: createdUser
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
  try {
    // Récupération de l'ID depuis req.params (fourni par l'URL) ou req.body par sécurité
    const userId = req.params.userId || req.body.userId;
    const { login, password, firstName, lastName, role } = req.body;
    console.log("update ID:", userId, "Data:", req.body);

    if (!userId) {
      return res.status(400).json({ success: false, msg: "ID utilisateur requis." });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const updateFields = {
      login,
      firstName,
      lastName,
      role
    };

    if (password && password.trim() !== "") {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const filter = { _id: new ObjectId(userId) };
    await usersCollection.updateOne(filter, { $set: updateFields });
    const updatedUser = await usersCollection.findOne(filter, { projection: { password: 0 } });

    return res.status(200).json({
      success: true,
      msg: "Utilisateur mis à jour avec succès.",
      data: updatedUser
    });
  } catch (error) {
    console.error("Erreur lors de la modification de l'utilisateur :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectToDatabase();
    
    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    return res.status(200).json({
      success: true,
      msg: "Utilisateur supprimé avec succès."
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
// Connexion d'un utilisateur
// Connexion d'un utilisateur
// Connexion d'un utilisateur
const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ success: false, msg: "Le login et le mot de passe sont requis." });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ login });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Identifiants incorrects." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, msg: "Identifiants incorrects." });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "votre_cle_secrete_par_defaut",
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      msg: "Connexion réussie.",
      data: {
        access_token: token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  loginUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};