const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    username: String,
        
    
    email:  String,
     
    
    pwd:  String,
       
    

}, );

const Users = mongoose.model("Users", userSchema)

export default Users