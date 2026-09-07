const jwt = require("jsonwebtoken");
const { connectToDatabase, client: dbConfig } = require("../config/dbConfig.js");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');
const mongoose = require("mongoose");

const UsersModel = require('../models/UsersModel.js');
const { io } = require("../app.js");

dotenv.config();

const signin = async (req, res) => {
  const secretKey = process.env.ACCESS_TOKEN2;

  try {
    const { Login, Password } = req.body;
    
    const db = await connectToDatabase();
    const collection = db.collection('user');
// const responsed = await collection.find({}).toArray();
//   console.log(responsed)
//   return res.status(200).json({
//         msg: "User does not exist.",
//         success: false,
//       });
        const response = await collection.findOne({ Login, Password});
  console.log(response)
    console.log(Login, Password);


    if (!response) {
      console.log("User not found");
      return res.status(200).json({
        msg: "User does not exist.",
        success: false,
      });
    } else {
      console.log("wesss access_token",response.Role)

      const access_token = jwt.sign(
        { id: response._id, Role: response.Role },
        secretKey,
        {}
      );
      const decodedToken = jwt.decode(access_token);
      if (decodedToken) {
        const userRole = decodedToken.Role;
 
      }
      
      const user = response;
      const role = String(user.type || user.Role || user.role || 'employee').toLowerCase() === 'admin'
        ? 'admin'
        : 'employee';
      const user2 = {
        access_token,
        idCRM: user.idCRM,
        userid: user._id,
        Nom: user.Nom,
        Setting: user.Setting,
        type: role,
        role,
      };

      return res.status(200).json({
        msg: "User found.",
        success: true,
        data: user2,
      });
    }
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};




const deleteIdUser = async (req, res) => {
  const userId = req.params.id; 
  const id =new mongoose.Types.ObjectId(userId)
  console.log(userId);
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');
    const response = await collection.findOne({ _id:id });

    if (!response) {
      console.log("User not found");
      return res.status(200).json({
        msg: "User does not exist.",
        success: false,
      });
    }

    await collection.deleteOne({  _id:id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the user' });
  }
};

const modifyUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    console.log(userId);
    const id =new mongoose.Types.ObjectId(userId)
    const db = await connectToDatabase();
    const collection = db.collection('user');
    const existingUser = await collection.findOne({ _id: id });
    if (!existingUser) {
      console.log("User does not exist");
      return res.status(404).json({
        msg: "User does not exist.",
        success: false,
      });
    }

    const { Nom, Login, Password, idCRM ,Email,Tel,Setting} = req.body;
   
// if(existingUser.Setting!=Setting){ req.io.emit(`UpdateSettingFor${idCRM}`, {  _id: existingUser._id}); 
// console.log(`UpdateSettingFor${idCRM}`);
// }
    const resaa = await collection.updateOne({ _id: id }, { $set: { Nom, Login, Password, idCRM ,Email,Tel,Setting} });

    return res.status(200).json({
      msg: "User modified successfully.",
      success: true,
      data:resaa
    });
  } catch (err) {
    console.error("An error occurred while modifying the user:", err);
    res.status(500).json({ msg: "An error occurred while modifying the user", success: false });
  }
};


 const getUserById = async (req, res) => {
  const userId = req.query.idUser;
  const _id = new ObjectId(userId); //
   const db = await connectToDatabase();
  const collection = db.collection('user');

  try {



    const response = await collection.findOne({ _id });
    
    if (!response) {
      console.log("User not found.........");
      return res.status(404).json({
        msg: "User not found.",
        success: false,
      });
    }

    const user = response;

    return res.status(200).json({
      msg: "User found.",
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};




const getUserByIDcrm = async (req, res) => {

  const  idCRM  =  req.params.idCRM;
  console.log(idCRM);
   const db = await connectToDatabase();
  const collection = db.collection('user');

  try {



    const response = await collection.findOne({ idCRM: idCRM});
    
    
    if (!response) {
      console.log("User not found......");
      return res.status(500).json({
        msg: "User not found.",
        success: false,
      });
    }

    const user = response;

    return res.status(200).json({
      msg: "User found.",
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};


 const signup = async (req, res) => {
  try {
    
    const { Nom, Login, Password, Tel, idCRM ,Prenom,Email,Address ,Setting} = req.body;
    const requestedType = String(req.body.type || req.body.role || req.body.Role || 'employee').toLowerCase();
    const type = requestedType === 'admin' ? 'admin' : 'employee';
    const db = await connectToDatabase();
    const collection = db.collection('user');

    const existingUser = await collection.findOne({ Login, idCRM });

    if (existingUser) {
      console.log("User already exists");
      return res.status(200).json({
        msg: "User already exists.",
        success: false,
      });
    }
        const Licence = "Enable";

    const Role = type;
    const LastCommand = ""
    
    const newUser = { Nom, Login, Password, Tel, idCRM, Role, type, Prenom,Email,Address,Licence,LastCommand,Setting,BaseName:"DefaultBase" };
    await collection.insertOne(newUser);
    const ss= await collection.findOne({ Login, idCRM});
    return res.status(200).json({
      msg: "User created successfully.",
      success: true,
      data: ss,
    });

  } catch (err) {
    res.status(500).json({ msg: err?.message, success: false });
  }
};


 const getUserByRole = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection('user');
  console.log(collection)
  try {
    const user = await collection.find({ Role: "employee" }).toArray();

    if (!user) {
      console.log("they are no users with role store");
      return res.status(404).json({
        msg: "they are no users with role store.",
        success: false,
      });
    }


    return res.status(200).json({
      msg: "Users found.",
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user by role:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};

 const getAllUsers = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');

    // const users = await collection.find({ Role: "store" }).toArray();
const users = await collection.find({ Role: { $ne: "admin" } }).toArray();
console.log("Wess allusers ",users)
    if (users.length === 0) {
      return res.status(404).json({
        msg: "Aucun utilisateur n'a été trouvé.",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Utilisateurs trouvés.",
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};


 

module.exports = { signin, getUserById, signup, getUserByRole, getAllUsers,deleteIdUser,modifyUser,getUserByIDcrm};
