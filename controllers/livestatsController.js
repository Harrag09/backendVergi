 const { connectToDatabase} = require('../config/dbConfig.js');
  const nodemailer = require('nodemailer');
  const fs = require('fs');
  const path = require('path');

const transporter = nodemailer.createTransport({
  host: 'makseb.fr',
  port: 465,
  auth: {
    type: 'custom',
    user: 'commandes@makseb.fr',
    pass: 'Makseb2024',
  },
  tls: {
    rejectUnauthorized: false
}
});
const sendWelcomeEmail = (req, res) => {
  const { email, lien, name } = req.body;
  // Define the email template as a string
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Email</title>
    </head>
    <body>
      <p>Bienvenue chez ${name} !</p>
      <p>Veuillez trouver ci-joint votre ticket : <a href="${lien}">cliquez ici</a></p>
      <p>Si vous avez des questions ou avez besoin d'assistance supplémentaire, n'hésitez pas à nous recontacter.</p>
      <p>Cordialement,</p>
      <p>${name}</p>
    </body>
    </html>
  `;
  const mailOptions = {
    from: 'commandes@makseb.fr',
    to: email,
    subject: 'Envoi de vos coordonnées de compte',
    html: emailTemplate, // Set the email template as the HTML body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail.' });
    } else {
    
      return res.status(200).json({ message: 'E-mail envoyé avec succès.' });
    }
  });
};
const sendPdfInEmail = (req, res) => {
  const { email, name,pdf } = req.body;
  // Define the email template as a string
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Email</title>
    </head>
    <body>
      <p>Bienvenue chez ${name} !</p>
      <p>Veuillez trouver ci-joint votre ticket : <a href="${lien}">cliquez ici</a></p>
      <p>Si vous avez des questions ou avez besoin d'assistance supplémentaire, n'hésitez pas à nous recontacter.</p>
      <p>Cordialement,</p>
      <p>${name}</p>
    </body>
    </html>
  `;
  const mailOptions = {
    from: 'commandes@makseb.fr',
    to: email,
    subject: 'Envoi de vos coordonnées de compte',
    html: emailTemplate, // Set the email template as the HTML body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail.' });
    } else {
    
      return res.status(200).json({ message: 'E-mail envoyé avec succès.' });
    }
  });
};
//cloturer work once : 
  const updateLivestat4 = async (req, res) => {
    const data = req.body;
  

    try {
      const db = await connectToDatabase();
      const collection = db.collection('livestats');
      

      
        const result = await collection.findOne({ IdCRM: data.IdCRM, date: data.date });
        const updateFields = {};
        for (const key in data) {

          updateFields[key] = data[key];
        }
        if (result) {


          await collection.updateOne(
            { _id: result._id },
            {
              $set: updateFields

            }
          );

          console.log("Updated successfully for IDCRM :",data.IdCRM);
        } else {
          console.log('No result found.');



          await collection.insertOne(updateFields);

          console.log("1 record inserted");
        }
      

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  //cloturer getReglement : 
  const updateLivestatForGetReglement = async (req, res) => {
    const data = req.body;
  

    try {
      const db = await connectToDatabase();
      const collection = db.collection('livestats');
      
      const collection2 = db.collection('TempsReels');
      
     
     
        await collection2.deleteMany({ IdCRM: data.IdCRM });
     

      
        const result = await collection.findOne({ IdCRM: data.IdCRM, date: data.date });
        const updateFields = {};
        for (const key in data) {

          updateFields[key] = data[key];
        }
        if (result) {


          await collection.updateOne(
            { _id: result._id },
            {
              $set: updateFields

            }
          );

          console.log("Updated successfully for IDCRM :",data.IdCRM);
        } else {
          console.log('No result found.');



          await collection.insertOne(updateFields);

          console.log("1 record inserted");
        }
      

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



//GetReglement()
  const updateLivestat3 = async (req, res) => {
    const data = req.body;
 console.log(data)

    try {
      const db = await connectToDatabase();
      const collection = db.collection('TempsReels');
      
     
      for (const livestat of data) {
        await collection.deleteMany({ IdCRM: livestat.IdCRM });
      }

    
      for (const livestat of data) {
        const updateFields = {};
        for (const key in livestat) {
          updateFields[key] = livestat[key];
        }
        console.log(updateFields);
        await collection.insertOne(updateFields);
      }

  
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };







const UpdateTiquer = async (req, res) => {
    const data = req.body;


    try {
      const db = await connectToDatabase();
      const collection = db.collection('Tiquer');

        const result = await collection.findOne({ IdCRM: data.IdCRM, Date: data.Date ,idTiquer :data.idTiquer ,HeureTicket:data.HeureTicket});
      
        const updateFields = {};
        for (const key in data) {

          updateFields[key] = data[key];
        }
        
        if (result) {

          console.log("aready Exist");
        } else {
          console.log('No result found.');



          await collection.insertOne(updateFields);

          console.log("1 Tiquer  inserted");
        }
      

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };









  const calculateSumsForEachLine = (objects, sumsForEachLine = {}) => {
    objects.forEach(obj => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sumsForEachLine[key] = calculateSumsForEachLine([obj[key]], sumsForEachLine[key] || {});
        }
        if (typeof obj[key] === 'number') {
          // If the value is a number, add it to the sum
          const result = (sumsForEachLine[key] || 0) + obj[key];
          sumsForEachLine[key] = Math.round(result * 100) / 100;
        }
        if (typeof obj[key] === 'string') {
          if (key != 'date') { sumsForEachLine[key] = obj[key]; }
        }
      }
    });

    return sumsForEachLine;
  };

  const getLivestatByIdandDate = async (req, res) => {
    try {
      const idCRM = req.query.idCRM; 
      const startDateString = req.query.date1;
      const endDateString = req.query.date2;

      const db = await connectToDatabase();
      const collection = db.collection('livestats');

      const livestats = await collection.aggregate([
        {
          $match: {
            IdCRM: idCRM,
            date: { $gte: startDateString, $lte: endDateString }
          }
        },
      ]).toArray();

      if (livestats.length === 0) {
    
        return res.status(200).json({ msg: "Rien de statistique trouvé pour ces dates spécifiées", success: true ,data:livestats});
      } else {
        const sumsForEachLine = calculateSumsForEachLine(livestats);
        res.status(200).json({ msg:"Des statistiques existent pour ces dates spécifiées", success: true ,data:sumsForEachLine});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const getLivestatByIdandDate2 = async (req, res) => {
    try {
      const idCRM = req.query.idCRM; 
      const startDateString = req.query.date1;
      const endDateString = req.query.date2;

      const db = await connectToDatabase();
      const collection = db.collection('TempsReels');

      const livestats = await collection.aggregate([
        {
          $match: {
            IdCRM: idCRM,
            date: { $gte: startDateString, $lte: endDateString }
          }
        },
      ]).toArray();
      if (livestats.length === 0) {
        return res.status(200).json({ msg: "Rien de statistique trouvé pour ces dates spécifiées", success: true ,data:livestats});
      } else {
        const sumsForEachLine = calculateSumsForEachLine(livestats);
        res.status(200).json({ msg:"Des statistiques existent pour ces dates spécifiées", success: true ,data:sumsForEachLine});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };




  const updateStatusStores = async (req, res) => {
    const data = req.body;
  //console.log("updateStatusStores",data)
    try {
      const db = await connectToDatabase();
      const collection = db.collection('user');
  
      const response = await collection.findOne({ idCRM: data.IdCRM });
    
      if (response) {
        if (data.LastCommand != null) {
          await collection.updateOne(
            { _id: response._id },
            {
              $set: {
                Status: 'Activer', 
                LastCommand: data.LastCommand,
                lastInteraction: new Date() 
              }
            }
          );
          // console.log("Updated status and last interaction successfully");
        }
        else{ await collection.updateOne(
          { _id: response._id },
          {
            $set: {
              Status: 'Activer', 
              lastInteraction: new Date() 
            }
          }
        );
        // console.log("Updated status and last interaction successfully");
      }
      }
  
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



const updateStatus = async () => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');

    //10
    const fiveMinutesAgo  = new Date(Date.now() - 10 * 60 * 1000);
    //5
    // const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); 

   
    await collection.updateMany(
      { lastInteraction: { $gt: fiveMinutesAgo } },
      { $set: { Status: 'Activer' } }
    );

    await collection.updateMany(
      { lastInteraction: { $lt: fiveMinutesAgo } },
      { $set: { Status: 'Désactiver' } }
    );

    console.log('updateStatus : Status for All user updated successfully');
  } catch (error) {
    console.error(error);
  }
};

  const GetLicence = async (req, res) => {

    try {
      const db = await connectToDatabase();
      const collection = db.collection('user');
      const idCRM = req.params.idCRM;
      const user = await collection.findOne({ idCRM: idCRM });

      let hasLicense = "EMakseb";
    
      if (user) {
        if(user.Licence==="Enable"){   hasLicense = "EMakseb";}
        else{hasLicense = "MaksebD";} 
      }
    
      res.json({ hasLicense });


    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  const GetBaseName = async (req, res) => {

    try {
      const db = await connectToDatabase();
      const collection = db.collection('user');
      const idCRM = req.params.idCRM;
      const data = req.body;
      const user = await collection.findOne({ idCRM: idCRM });
   const BaseName=user.BaseName
   let Licence
   if(user.Licence==="Enable"){Licence="EMakseb"}
   else if (user.Licence==="Disable"){Licence="MaksebD"}
    
  if (user) {
       await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          Status: 'Activer', 
          lastInteraction: new Date() 
        }
      }
    );  
      if ((BaseName==="BaseModeEcole")||(BaseName==="DefaultBase")||(BaseName==="BaseVierge") ){

        res.json({ BaseName,Licence });
      }else{
        BaseName="Vide"
        res.json({BaseName,Licence});}
      }
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const UpdateLicence = async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('user');
      const idCRM = req.params.idCRM;
      const action = req.params.action;
      console.log("update Licence for :",idCRM,"new Licence :", action);

      if (action === '') {
        return res.status(400).json({ error: 'Invalid action' });
      }
      const response = await collection.findOne({ idCRM: idCRM });
      await collection.updateOne(
        { _id: response._id },
        {
          $set: {
            Licence: action

          }
        }
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const GetTable = async (req, res) => {
    try {
      // const db = await connectToDatabase();
      // const collection = db.collection('user');
      const data = req.body;
     
      console.log("data:",data);

      res.json({ table: table });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  
  const UpdateBaseDeDonne = async (req, res) => {

    try {
      const db = await connectToDatabase();
      const collection = db.collection('user');
      const idCRM = req.params.idCRM;
      const action = req.params.action;
      console.log("update Base for :",idCRM," new Base is  :", action);

      if (action === '') {
        return res.status(400).json({ error: 'Invalid action' });
      }
      const response = await collection.findOne({ idCRM: idCRM });
      await collection.updateOne(
        { _id: response._id },
        {
          $set: {
            BaseName: action

          }
        }
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  };






  const updateAllCatInUploid = async (req, res) => {
    try {
      const data = req.body;

      const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
      const decodedImage = Buffer.from(base64Data, 'base64');

      const parentFolderPath = path.join(__dirname, '..'); // Go up one directory level
      const folderPath = path.join(parentFolderPath, 'uploads', data.IdCRM);
    

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); 
      }

      const filename = `${data.Categories}.png`;

      fs.writeFileSync(path.join(folderPath, filename), decodedImage);

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



  const updateAllCatCripteInMongo = async (req, res) => {
    try {
      const data = req.body;
      
      const db = await connectToDatabase();
      const collection = db.collection('Images');
      console.log(" Get All image caisse and insert it in mngodb for :", data.IdCRM);

      const result = await collection.findOne({ IdCRM: data.IdCRM, Categories: data.Categories });



      if (result) {
        await collection.updateOne(
          { _id: result._id },
          { $set: data }
        );
        console.log("Updated Catégories");
      } else {
        console.log('No result found.');
        await collection.insertOne(data);
        console.log("1 Catégories inserted");
      }

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  const getAllCatInUploid = async (req, res) => {
    try {
      const { IdCRM } = req.query; // Assuming IdCRM is sent as a query parameter

      const parentFolderPath = path.join(__dirname, '..'); // Go up one directory level
      const folderPath = path.join(parentFolderPath, 'uploads', IdCRM);

      if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: "Folder not found" });
      }

      const files = fs.readdirSync(folderPath);

      // Filter out only the image files

      const imageNames = files.filter(file => fs.statSync(path.join(folderPath, file)).isFile())
                              .map(file => file.split('.')[0]);
      
      res.status(200).json({ imageNames  });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const getTiquerId = async (req, res) => {
    try {
      const idCRM = req.query.idCRM; 
      const startDateString = req.query.date1;
      const endDateString = req.query.date2;

      const db = await connectToDatabase();
      const collection = db.collection('Tiquer');

      const livestats = await collection.aggregate([
        {
          $match: {
            idCRM: idCRM,
            Date: { $gte:  startDateString, $lte: endDateString }
          }
        },
      ]).toArray();
   
      if (livestats.length === 0) {
        return res.status(404).json({ error: "Livestats not found within the specified date range" });
      } else {
      
        res.json(livestats);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };












  const generateTicketsHTML33 = async (req, res) => {
    try{

    const qrcode = req.params.qrcode;
    console.log("qrcode :",qrcode)
    const db = await connectToDatabase();
    const collection = db.collection('Tiquer');
    const data = await collection.findOne({ codeqr:qrcode});
  console.log("data",data)
  
  // console.log(data, data.ChiffreAffaire.Total_Ht)
  let htmlContent = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Ticket Restaurant</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
      /* Custom CSS for ticket */
       body {
    background-color: #f2f2f2; /* Light gray for a neutral background */
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .ticket {
    background: #fff; /* Pure white background for contrast */
    max-width: 440px;
    margin: auto;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    padding: 24px;
    overflow: hidden;
  }

  /* Header section */
  .ticket-header {
    text-align: center;
    padding-bottom: 12px;
    border-bottom: 2px solid #e6e6e6; /* Subtle gray border */
    margin-bottom: 20px;
  }

  .ticket-header h5 {
    margin: 0;
    font-size: 1.8rem;
    color: #333; /* Neutral dark text */
    font-weight: 700;
  }

  .ticket-header p {
    margin: 8px 0 0;
    font-size: 0.95rem;
    color: #888; /* Light gray for subtle text */
  }

  /* Ticket ID styling */
  .TicketID {
    text-align: center;
    font-size: 1.2rem;
    font-weight: 700;
    color: #444; /* Slightly darker gray */
    background: #f9f9f9; /* Very light gray for emphasis */
    padding: 10px;
    border-radius: 6px;
    margin: 20px 0;
  }

      .Ligne1 {
        border-bottom: 1px dashed #ccc;
        margin-bottom: 18px;
      }
      .Ligne2{
        border-bottom: 1px solid #ccc;
        margin-right: 25px;
       
      }
      .StyledTable{
          width: 100%;
          margin-left: 10px;
      }
      .StyledTable2{
          width: 100%;
          margin-left: 25px;
      
      }
      .Fist{width: 68%;}
      .Fist2{width: 80%;}
   .ProductName{
      font-size: 0.8rem;
   }
   .GredientName{
      font-size: 0.7rem;
     
   }
   .Taux{
      font-size: 0.9rem;
     
   }
   .GredientTD{
   padding-left: 20px;
   padding-top: -10px;
   }
   .SuplimentTD{
    padding-left: 10px;
   padding-top: -10px;
   }
   .tabletva{
    align-items: center;
  
   }
   .totalText{
      padding-left: 150px;
      font-size: 1.4rem;
    
     }
   .HTtext{
    padding-left: 10px;
    font-size: 0.9rem;
  
   }
   .DivtotalText{
    padding-top: 10px;
  
   }
   .centered-text {
      text-align: center;
      margin-top: -16px;
      
    }
    .bold-text {
      font-weight: bold;
      font-size: 1.3rem;
  
    }
    .spacer {
      height: 7px;
     
  }
  .SignTEXT{
      height: 120px;
    }
  
  @media print {
    body {
      background-color: #fff;
    }

    .ticket {
      box-shadow: none;
      border: none;
    }
  }
     button {
  background: linear-gradient(135deg, #6a11cb, #2575fc); /* Gradient background */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover effect */
button:hover {
  transform: translateY(-3px); /* Lift effect */
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
}

/* Active click effect */
button:active {
  transform: translateY(1px);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Reset shadow */
}
    </style>
  </head>
  <body>
  `;
  
  
  const ticketDate = new Date(data?.Date?.substring(0, 4), parseInt(data?.Date?.substring(4, 6)) - 1, data?.Date?.substring(6, 8));
  const formattedDate = ticketDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
  });
  htmlContent += `
  
      <div class="ticket">
      <!-- Ticket Header -->
      <div class="ticket-header">
        <h5>${data?.NomSociete}</h5>
        <p>${data?.sAdress}<BR>
        ${data?.ville}</p>
        <div class="Ligne1"></div>
        <div>Suivi par : Admin Le ${formattedDate} / ${data?.HeureTicket} </div>
        <div class="Ligne1"></div><div class="Ligne1"></div>
      </div>
  
    
      <h5 class="TicketID"><b>TICKET  : ${data?.idTiquer}</b></h5><br>
      <div class="Ligne1"></div>
      <div ></div>
  
      <table class="StyledTable">
      <thead>
          <tr>
              <td class="Fist"><text class="ProductName"><b></b></text></td>
  
              <td><b>PU</b></td>
              <td><b>TTC</b></td>
  
          </tr>
          
      </thead>
  </table>
      <div class="Ligne2"></div>
      `;
  data?.Menu?.forEach(item => {
  
  
    // if(item.TTC > 0){
  
    //   htmlContent += `
  
    //     <table class="StyledTable">
    //     <tbody>
    //         <tr>
    //             <td class="Fist"><text class="ProductName"><b>${item.QtyProduct}  ${item.NameProduct}</b></text></td>
  
    //             <td>${item.TTC > 0 ? item.TTC / item.QtyProduct : ''} </td>
    //             <td>${item.TTC > 0 ? item.TTC : ''} ${item.TTC > 0 ? data.devise : ''}</td>
    //         </tr>
    //         `;
    //   htmlContent += `<tr class="spacer"></tr>`;
          
    //   if (item.Sup && item.Sup.length > 0) {
    //       item.Sup.forEach(option => {
    //         console.log("option :",option);
    //           htmlContent += `
    //       <tr >
    //         <td class="SuplimentTD" ><text class="GredientName"><b>${option.QtyProduct} X ${option.NameProduct}</b></text></td>
    //         <td >${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
    //         <td >${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td> `
    //             if (option.Gredient2 && option.Gredient2.length > 0) {
    //                  option.Gredient2.forEach(option2 => {
    //                    htmlContent += `
    //                        <tr >
    //                        <td class="GredientTD" ><text class="GredientName"><b>(SANS)zaeazez ${option.NameProduct}</b></text></td>
    //                        <td >${option2.TTC > 0 ? option2.TTC / option2.QtyProduct : ''}</td>
    //                        <td >${option2.TTC > 0 ? option2.TTC : ''} ${option2.TTC > 0 ? data.devise : ''}</td>
    //                        </tr>
    //             `;
      
    //           });
    //       }
    //       htmlContent += `<tr class="spacer">
            
    //           </tr>`;
    //   if (option.Gredient && option.Gredient.length > 0) {
        
    //     option.Gredient.forEach(option2 => {
    //       let qty 
    //       if(option2.QtyProduct===0){qty =1}
    //       else{qty=option2.QtyProduct+1}
    //           htmlContent += `
    //         <tr >
    //             <td class="GredientTD" ><text class="GredientName"><b>${qty} X  ${option.NameProduct}</b></text></td>
    //             <td >${option2.TTC > 0 ? option2.TTC / qty : ''}</td>
    //             <td >${option2.TTC > 0 ? option2.TTC : ''} ${option2.TTC > 0 ? data.devise : ''}</td>
    //         </tr>
    //         `;
  
    //       });
    //   }

    //      `</tr>
    //     `;
    //       });
    //   }
    // }else{
        htmlContent += `
  
        <table class="StyledTable">
        <tbody>
            <tr>
                <td class="Fist"><text class="ProductName"><b>${item.QtyProduct}  ${item.NameProduct}</b></text></td>
  
                <td>${item.TTC.toFixed(2) > 0 ? (item.TTC.toFixed(2) / item.QtyProduct).toFixed(2) : ''} </td>
                <td>${item.TTC.toFixed(2) > 0 ? item.TTC.toFixed(2) : ''} ${item.TTC > 0 ? data.devise : ''}</td>
            </tr>
            `;
  
            htmlContent += `<tr class="spacer">
            
            </tr>`;
  
           
     
          
      
        if (item.Sup ) { // Ensure there are at least two items
            for (let i = 0; i < item.Sup.length; i++) { // Start from the second item
                const option = item.Sup[i];
                htmlContent += `
          
                <tr> `;

                if(option.NameProduct!=undefined){
                  htmlContent += `
                  <td class="SuplimentTD"><text class="GredientName"><b>${option.QtyProduct} X ${option.NameProduct}</b></text></td>
                  <td>${option.TTC.toFixed(2) > 0 ? (option.TTC.toFixed(2) / option.QtyProduct).toFixed(2) : ''}</td>
                  <td>${option.TTC.toFixed(2) > 0 ? option.TTC.toFixed(2) : ''} ${option.TTC > 0 ? data.devise : ''}</td>`
                }
              
                  if (option.Gredient2 && option.Gredient2.length > 0) {
                    
                    option.Gredient2.forEach(option2 => {
                      let qty 
                      if(option2.QtyProduct===0){qty =1}
                      else{qty=option2.QtyProduct+1}
                        htmlContent += `
                      <tr >
                          <td class="GredientTD" ><text class="GredientName"><b>(SANS) ${option2.NameProduct}</b></text></td>
                          <td >${option2.TTC.toFixed(2) > 0 ? (option2.TTC.toFixed(2) /qty).toFixed(2): ''}</td>
                          <td >${option2.TTC.toFixed(2) > 0 ? option2.TTC.toFixed(2) : ''} ${option2.TTC > 0 ? data.devise : ''}</td>
                      </tr>
                      `;
            
                    });
                }
                htmlContent += `<tr class="spacer">
                   
                    </tr>`;
                  if (option.Gredient && option.Gredient.length > 0) {
                    option.Gredient.forEach(option2 => {
                        let qty 
                        if(option2.QtyProduct===0){qty =1}
                        else{qty=option2.QtyProduct+1}
                          htmlContent += `
                        <tr >
                            <td class="GredientTD" ><text class="GredientName"><b>${qty} X  ${option2.NameProduct}</b></text></td>
                            <td >${option2.TTC.toFixed(2) > 0 ? (option2.TTC.toFixed(2) / qty).toFixed(2): ''}</td>
                            <td >${option2.TTC.toFixed(2) > 0 ? option2.TTC.toFixed(2) : ''} ${option2.TTC > 0 ? data.devise : ''}</td>
                        </tr>
                        `;
            
                      });
                  }
                  htmlContent += `<tr class="spacer">
                     
                      </tr>`;
                `</tr>
                `;
            }
        }
    // }
  
  
  
  
      htmlContent += `
        </tbody>
    </table>  <div class="Ligne2"></div>`;
  }
);
  
  htmlContent += `
  <div class="Ligne2"></div>
  <br><div>
  <text class="HTtext">Montant HT : ${data?.ChiffreAffaire?.Total_Ht.toFixed(2) ? data?.ChiffreAffaire?.Total_Ht.toFixed(2) : ''} ${data?.devise} *** *** TVA : ${data?.ChiffreAffaire?.Total_TVA ? data?.ChiffreAffaire?.Total_TVA.toFixed(2) : ''} ${data?.devise}  </text></div>
  <div class="DivtotalText">
    <text class="totalText"><b>TOTAL : ${data?.ChiffreAffaire.Total_TTC.toFixed(2) ? data?.ChiffreAffaire.Total_TTC.toFixed(2) : ''}  ${data?.devise}</b> </text>
  </div>
  
  <div class="Ligne2"></div>
  
   
  <table  class="StyledTable" >
    <tbody>
    `;
  data?.ModePaiement?.forEach(payment => {
      htmlContent += `
        <tr >
            <td class="Fist" ><text class="Taux"><b>${payment.ModePaimeent}</b></text></td>
  
            <td ><text class="Taux"><b>${payment.totalwithMode.toFixed(2)} ${data.devise}</b></text></td>
        </tr>
        `;
  });
  htmlContent += `
  
      
    </tbody>
  </table>
  <div class="Ligne1"></div><div class="Ligne1"></div>
  
  
  <table  class="StyledTable2" >
  <tbody>
  <tr >
  <td ><text class="Taux"><b>TAUX</b></text></td>
    <td  ><text class="Taux"><b>HT</b></text></td>
    <td ><text class="Taux"><b>TVA</b></text></td>
    <td ><text class="Taux"><b>TTC</b></text></td>
  </tr>
  `;
  for (const key in data?.ChiffreAffaireDetailler) {
      if (data?.ChiffreAffaireDetailler.hasOwnProperty(key)) {
          const Chiffre = data.ChiffreAffaireDetailler[key];
          htmlContent += `
      <tr >
        <td ><text class="Taux"><b>${Chiffre.Taux}</b></text></td>
          <td  ><text class="Taux"><b>${Chiffre.HT.toFixed(2)}</b></text></td>
          <td ><text class="Taux"><b>${Chiffre.TVA.toFixed(2)}</b></text></td>
          <td ><text class="Taux"><b>${Chiffre.TTC.toFixed(2)}</b></text></td>
      </tr>
      `;
      }
  }
  htmlContent += `
  </tbody>
  </table>
  
  <div class="Ligne1"></div><div class="Ligne1"></div>
  
  <div class="centered-text">
  <text class="bold-text ModeConsomation">${data?.ModeConsomation.toUpperCase()}</text>
  </div>
  
  <div class="Ligne1"></div><div class="Ligne1"></div>
  
   <div class="centered-text">
   <Center>Votre recus paiement</Center>
    <br></br> 
 <text>${data?.RetrunPaiement?.trim()}</text>
  </div>
     <br></br> 
  <div class="Ligne1"></div><div class="Ligne1"></div>
  <div class="centered-text">
  <text >MERCI DE VOTRE VISITE <br> A TRES BIENTOT </text>
  </div><br>
  <div class="SignTEXT">${data?.sign}</div>
  <button onclick="window.print()">Print</button>

  </div>      
  </body>
  </html>  `;
  
  res.send(htmlContent);
  }catch(err){
        console.log(err);
  }
  };
  
  
  
  
  
  
  
  
  
  





const generateTicketsHTML = async (req, res) => {
  try{


  const data2 = JSON.parse(req.query.data);
  const db = await connectToDatabase();
  const collection = db.collection('Tiquer');
  const data = await collection.findOne({ idCRM: data2.idCRM, HeureTicket: data2.HeureTicket,idTiquer:data2.idTiquer });


// console.log(data, data.ChiffreAffaire.Total_Ht)
let htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> Ticket Restaurant</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    /* Custom CSS for ticket */
    .ticket {

      width: 100%;
      margin: 0 auto;
      margin-top: 5px;
      margin-left: 5px;

      font-family: Arial, sans-serif;
      border: 1px solid #ccc;
      padding: 5px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .ticket-header {
      text-align: center;
      margin-bottom: 5px;
      padding-top: 15px;
    }
    .TicketID{
        margin-top: -10px;  
        font-size: 1.6rem;
    }
    .Ligne1 {
      border-bottom: 1px dashed #ccc;
      margin-bottom: 18px;
    }
    .Ligne2{
      border-bottom: 1px solid #ccc;
      margin-right: 25px;
     
    }
    .StyledTable{
        width: 100%;
        margin-left: 10px;
    }
    .StyledTable2{
        width: 100%;
        margin-left: 25px;
    
    }
    .Fist{width: 68%;}
    .Fist2{width: 80%;}
 .ProductName{
    font-size: 0.8rem;
 }
 .GredientName{
    font-size: 0.7rem;
   
 }
 .Taux{
    font-size: 0.9rem;
   
 }
 .GredientTD{
 padding-left: 20px;
 padding-top: -10px;
 }
 .SuplimentTD{
  padding-left: 10px;
 padding-top: -10px;
 }
 .tabletva{
  align-items: center;

 }
 .totalText{
    padding-left: 150px;
    font-size: 1.4rem;
  
   }
 .HTtext{
  padding-left: 10px;
  font-size: 0.9rem;

 }
 .DivtotalText{
  padding-top: 10px;

 }
 .centered-text {
    text-align: center;
    margin-top: -16px;
    
  }
  .bold-text {
    font-weight: bold;
    font-size: 1.3rem;

  }
  .spacer {
    height: 7px;
   
}
.SignTEXT{
    height: 120px;
  }


  </style>
</head>
<body>
`;


const ticketDate = new Date(data.Date.substring(0, 4), parseInt(data.Date.substring(4, 6)) - 1, data.Date.substring(6, 8));
const formattedDate = ticketDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
});
htmlContent += `

    <div class="ticket">
    <!-- Ticket Header -->
    <div class="ticket-header">
      <h5>${data.NomSociete}</h5>
      <p>${data.sAdress}<BR>
      ${data.ville}</p>
      <div class="Ligne1"></div>
      <div>Suivi par : Admin Le ${formattedDate} / ${data.HeureTicket} </div>
      <div class="Ligne1"></div><div class="Ligne1"></div>
    </div>

  
    <h5 class="TicketID"><b>TICKET  : ${data.idTiquer}</b></h5><br>
    <div class="Ligne1"></div>
    <div ></div>

    <table class="StyledTable">
    <thead>
        <tr>
            <td class="Fist"><text class="ProductName"><b></b></text></td>

            <td><b>PU</b></td>
            <td><b>TTC</b></td>

        </tr>
        
    </thead>
</table>
    <div class="Ligne2"></div>
    `;
data.Menu.forEach(item => {


  if(item.TTC > 0){

    htmlContent += `

      <table class="StyledTable">
      <tbody>
          <tr>
              <td class="Fist"><text class="ProductName"><b>${item.QtyProduct}  ${item.NameProduct}</b></text></td>

              <td>${item.TTC > 0 ? item.TTC / item.QtyProduct : ''} </td>
              <td>${item.TTC > 0 ? item.TTC : ''} ${item.TTC > 0 ? data.devise : ''}</td>
          </tr>
          `;
          if (item.Gredient2 && item.Gredient2.length > 0) {
            item.Gredient2.forEach(option => {
                htmlContent += `
              <tr >
                  <td class="GredientTD" ><text class="GredientName"><b>(SANS) ${option.NameProduct}</b></text></td>
                  <td >${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
                  <td >${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td>
              </tr>
              `;
    
            });
        }
        htmlContent += `<tr class="spacer">
            <td></td>
            <td></td>
            <td></td>
            </tr>`;
    if (item.Gredient && item.Gredient.length > 0) {
        item.Gredient.forEach(option => {
            htmlContent += `
          <tr >
              <td class="GredientTD" ><text class="GredientName"><b>${option.QtyProduct} X  ${option.NameProduct}</b></text></td>
              <td >${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
              <td >${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td>
          </tr>
          `;

        });
    }
    htmlContent += `<tr class="spacer">
        <td></td>
        <td></td>
        <td></td>
        </tr>`;
    if (item.Sup && item.Sup.length > 0) {
        item.Sup.forEach(option => {
            htmlContent += `

        <tr >
          <td class="SuplimentTD" ><text class="GredientName"><b>${option.QtyProduct} X ${option.NameProduct}</b></text></td>
          <td >${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
          <td >${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td>
      </tr>
      `;
        });
    }
  }else{
      htmlContent += `

      <table class="StyledTable">
      <tbody>
          <tr>
              <td class="Fist"><text class="ProductName"><b>${item.QtyProduct}  ${item.NameProduct}</b></text></td>

              <td>${item.TTC > 0 ? item.TTC / item.QtyProduct : ''} </td>
              <td>${item.TTC > 0 ? item.TTC : ''} ${item.TTC > 0 ? data.devise : ''}</td>
          </tr>
          `;

          htmlContent += `<tr class="spacer">
          <td></td>
          <td></td>
          <td></td>
          </tr>`;

            htmlContent += `

        <tr >
          <td class="SuplimentTD" ><text class="GredientName"><b>${item.Sup[0].QtyProduct} X ${item.Sup[0].NameProduct}</b></text></td>
          <td >${item.Sup[0].TTC > 0 ? item.Sup[0].TTC / item.Sup[0].QtyProduct : ''}</td>
          <td >${item.Sup[0].TTC > 0 ? item.Sup[0].TTC : ''} ${item.Sup[0].TTC > 0 ? data.devise : ''}</td>
      </tr>
      `;
      if (item.Gredient2 && item.Gredient2.length > 0) {
        item.Gredient2.forEach(option => {
            htmlContent += `
          <tr >
              <td class="GredientTD" ><text class="GredientName"><b>(SANS) ${option.NameProduct}</b></text></td>
              <td >${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
              <td >${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td>
          </tr>
          `;

        });
    }
    htmlContent += `<tr class="spacer">
        <td></td>
        <td></td>
        <td></td>
        </tr>`;
      if (item.Gredient && item.Gredient.length > 0) {
          item.Gredient.forEach(option => {
              htmlContent += `
            <tr >
                <td class="GredientTD" ><text class="GredientName"><b>${option.QtyProduct} X  ${option.NameProduct}</b></text></td>
                <td >${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
                <td >${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td>
            </tr>
            `;

          });
      }
      htmlContent += `<tr class="spacer">
          <td></td>
          <td></td>
          <td></td>
          </tr>`;
        
    
      if (item.Sup && item.Sup.length > 1) { // Ensure there are at least two items
          for (let i = 1; i < item.Sup.length; i++) { // Start from the second item
              const option = item.Sup[i];
              htmlContent += `
        
              <tr>
                <td class="SuplimentTD"><text class="GredientName"><b>${option.QtyProduct} X ${option.NameProduct}</b></text></td>
                <td>${option.TTC > 0 ? option.TTC / option.QtyProduct : ''}</td>
                <td>${option.TTC > 0 ? option.TTC : ''} ${option.TTC > 0 ? data.devise : ''}</td>
              </tr>
              `;
          }
      }
  }




    htmlContent += `
      </tbody>
  </table>  <div class="Ligne2"></div>`;
});

htmlContent += `
<div class="Ligne2"></div>
<br><div>
<text class="HTtext">Montant HT : ${data.ChiffreAffaire.Total_Ht ? data.ChiffreAffaire.Total_Ht : ''} ${data.devise} *** *** TVA : ${data.ChiffreAffaire.Total_TVA ? data.ChiffreAffaire.Total_TVA : ''} ${data.devise}  </text></div>
<div class="DivtotalText">
  <text class="totalText"><b>TOTAL : ${data.ChiffreAffaire.Total_TTC ? data.ChiffreAffaire.Total_TTC : ''}  ${data.devise}</b> </text>
</div>

<div class="Ligne2"></div>

 
<table  class="StyledTable" >
  <tbody>
  `;
data.ModePaiement.forEach(payment => {
    htmlContent += `
      <tr >
          <td class="Fist" ><text class="Taux"><b>${payment.ModePaimeent}</b></text></td>

          <td ><text class="Taux"><b>${payment.totalwithMode} ${data.devise}</b></text></td>
      </tr>
      `;
});
htmlContent += `

    
  </tbody>
</table>
<div class="Ligne1"></div><div class="Ligne1"></div>


<table  class="StyledTable2" >
<tbody>
<tr >
<td ><text class="Taux"><b>TAUX</b></text></td>
  <td  ><text class="Taux"><b>HT</b></text></td>
  <td ><text class="Taux"><b>TVA</b></text></td>
  <td ><text class="Taux"><b>TTC</b></text></td>
</tr>
`;
for (const key in data.ChiffreAffaireDetailler) {
    if (data.ChiffreAffaireDetailler.hasOwnProperty(key)) {
        const Chiffre = data.ChiffreAffaireDetailler[key];
        htmlContent += `
    <tr >
      <td ><text class="Taux"><b>${Chiffre.Taux}</b></text></td>
        <td  ><text class="Taux"><b>${Chiffre.HT}</b></text></td>
        <td ><text class="Taux"><b>${Chiffre.TVA}</b></text></td>
        <td ><text class="Taux"><b>${Chiffre.TTC}</b></text></td>
    </tr>
    `;
    }
}
htmlContent += `
</tbody>
</table>

<div class="Ligne1"></div><div class="Ligne1"></div>

<div class="centered-text">
<text class="bold-text ModeConsomation">${data.ModeConsomation.toUpperCase()}</text>
</div>
<div class="Ligne1"></div><div class="Ligne1"></div>
<div class="centered-text">
<text >MERCI DE VOTRE VISITE <br> A TRES BIENTOT </text>
</div><br>
<div class="SignTEXT">${data.sign}</div>

</div>      
</body>
</html>  `;

res.send(htmlContent);
}catch(err){
      console.log(err);
}
};




















  const generateTicketsHTML2 = async (req, res) => {
    const idCRM = req.query.idCRM;
    const HeureTicket = req.query.HeureTicket;
    const idTiquer = req.query.idTiquer;
 
    const db = await connectToDatabase();
    const collection = db.collection('Tiquer');
    const livestats = await collection.aggregate([
      {
        $match: {
          idCRM: idCRM,
          HeureTicket: HeureTicket,
          idTiquer: idTiquer
        }
      },
    ]).toArray();
    
    tickets = livestats;
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tickets</title>
        <style>
            /* Define your CSS styles here */
            body {
                font-family: Arial, sans-serif;
            }
            .ticket {
                margin: 20px;
                padding: 10px;
                border: 1px solid #ccc;
                borderRadius: 8px;
                padding: 10px;
                margin: 10px;
                marginBottom: 10px;
                width: 507px;
            }
            .ticket-details {
                margin-bottom: 10px;
            }
            .items-list {
                margin-top: 10px;
            }
            .item {
                margin-bottom: 5px;
            }
            .items {
              margin-left: 30px;
          }
            .payment-details {
                margin-top: 10px;
            }
            .test{
              margin:100px
            }
            /* Add more styles as needed */
        </style>
    </head>
    <body>
    `;
    if (tickets) {
      tickets.forEach(ticket => {
        const ticketDate = new Date(ticket.Date.substring(0, 4), parseInt(ticket.Date.substring(4, 6)) - 1, ticket.Date.substring(6, 8));
        const formattedDate = ticketDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        htmlContent += `
        <div class="ticket">
            <div class="ticket-details">
                <p>ALIZETH DIGITAL EL MAY DJERBA 4175 DJERBA</p>
                <p style='padding-left: 220px;'>${formattedDate} ${ticket.HeureTicket}</p>
                <p>Servi par: ADMIN</p>
                <h1><b>TICKET: ${ticket.idTiquer}</b></h1>
            </div>
            <div class="items-list">
                <ul>
                <table>
    <tbody>
    <tr>
    <td>     <div ><span style='padding: 10px; padding-left: 300px;'>PU</span> TTC</div></td>
    </tr>
    </tbody>
  </table>
        `;
        let totalHT = 0;
        let totalTVA = 0;
        ticket.Menu.forEach(item => {
          totalHT += item.HT * item.QtyProduct;
          totalTVA += item.TVA * item.QtyProduct;
          htmlContent += `
          ---------------------------------------------------------------------------------------
          <table border=0>
          <tbody>
            <tr>
              <td style='width: 280px;'>
                <div class="item">${item.QtyProduct}. ${item.NameProduct}:</div>
              </td>
              <td >
                <div '><span  style='padding: 10px;'>${item.TTC} </span>${item.QtyProduct * item.TTC} ${ticket.devise}</div>
              </td>
            </tr>
          </tbody>
        </table>
          `;
          if (item.Gredient && item.Gredient.length > 0) {
            item.Gredient.forEach(option => {
              if (option.TTC != 0) {
                totalHT += option.HT * option.QtyProduct;
                const optionTVA = option.TVA;
                totalTVA += optionTVA * option.QtyProduct;
                htmlContent += `
                <table border=0>
                  <tr>
                    <td style='width: 280px;'>
                      <div class="items">${option.NameProduct}:</div>
                    </td>
                    <td >
                      <div '><span  style='padding: 10px;'>${option.TTC} </span>   ${option.TTC * option.QtyProduct} ${ticket.devise}</div>
                    </td>
                  </tr>
                    `;
              } else {
                totalHT += option.HT * option.QtyProduct;
                const optionTVA = option.TVA;
                totalTVA += optionTVA * option.QtyProduct;
                htmlContent += `
                <tr>
                <td style='width: 280px;'>
                <p   class="items">${option.NameProduct} </p>
                </td>
                </tr>
              </table>
                `;
              }
            });
          }
          if (item.Sup && item.Sup.length > 0) {
            item.Sup.forEach(option => {
              totalHT += option.HT * option.QtyProduct;
                const optionTVA = option.TVA;
                totalTVA += optionTVA * option.QtyProduct;
              htmlContent += `
              <table border=0>
              <tbody>
                <tr>
                  <td style='width: 280px;'>
                    <div class="items">${option.QtyProduct}. ${option.NameProduct}:</div>
                  </td>
                  <td >
                    <div '><span  style='padding: 10px;'>${option.TTC} </span>   ${option.TTC * option.QtyProduct} ${ticket.devise}</div>
                  </td>
                </tr>
              </tbody>
            </table>
              `;
            });
          }
        });
        htmlContent += `
            </div>
            <div class="payment-details">
            -----------------------------------------------------------------------------------------------
        `;
      htmlContent += `
          <table border=0>
          <tbody>
            <tr>
              <td style='width: 280px;'>
              MONTANT  HT:  ${totalHT.toFixed(1)}${ticket.devise}
              </td>
              <td >
                <div '><span  style='padding: 10px;'>TOTAL: </span> ${ticket.TTC} ${ticket.devise}</div>
              </td>
            </tr>
            <tr >
            <td style='width: 280px;'>
              </td>
            <td >
            <div '><span  style='padding: 10px;'>DONT TVA:  </span>  ${totalTVA.toFixed(1)}${ticket.devise}</div>
          </td>
            </tr>
          </tbody>
        </table>
          -----------------------------------------------------------------------------------------------
          `;
        ticket.ModePaiement.forEach(payment => {
          htmlContent += `
          <table border=0>
          <tbody>
            <tr>
              <td style='width: 280px;'>
                <div class="items">${payment.ModePaimeent}:</div>
              </td>
              <td >
                <div '><span  style='padding: 20px;'> </span> ${payment.totalwithMode} ${ticket.devise}</div>
              </td>
            </tr>
          </tbody>
        </table>
          -----------------------------------------------------------------------------------------------
          `;
        });
        htmlContent += `
            </div>
            <div class="closing-note">
                <p style='padding-left: 180px;'>${ticket.ModeConsomation.toUpperCase()}</p>
                -----------------------------------------------------------------------------------------------
                <p style='padding-left: 80px;'>MERCI DE VOTRE VISITE A TRES BIENTOT</p>
            </div>
        </div>
        `;
      });
    }
    htmlContent += `
    </body>
    </html>
    `;
    res.send(htmlContent);
  };
  module.exports = {generateTicketsHTML33,GetTable,updateLivestatForGetReglement,GetBaseName,sendPdfInEmail,updateStatus,sendWelcomeEmail ,generateTicketsHTML2,generateTicketsHTML,getTiquerId,UpdateTiquer, getLivestatByIdandDate2,getAllCatInUploid,updateAllCatCripteInMongo, updateAllCatInUploid, UpdateLicence,UpdateBaseDeDonne,updateLivestat3,updateLivestat4, getLivestatByIdandDate, updateStatusStores, GetLicence };
