// const mongoose = require("mongoose");


// const userSchema = new mongoose.Schema({
//   Nom: {
//     type: String,
//     required: true,
//   },
//   Prenom: {
//     type: String,
//     required: true,
//   },
//   Login: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   Password: {
//     type: String,
//     required: true,
//   },
//   Email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   Tel: {
//     type: String,
//     required: true,
//   },
//   Address: {
//     type: String, // Assuming Address is a string, adjust the type accordingly
//     required: false, // Adjust as needed
//   },

//   idCRM: {
//     type: String, // Assuming idCRM is a string, adjust the type accordingly
//     required: false, // Adjust as needed
//   },
//   Role: {
//     type: String,
//     required: true,
//     enum: ['admin', 'user'],
//   },
// });

// const UsersModel = mongoose.model('users', userSchema);

// export default UsersModel;
