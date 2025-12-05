// ========================== CONFIGURATION ET PREPARATION =======================
// Importez les modules
const express = require("express"); // Express pour créer le serveur web
const app = express(); // Créez une instance d'application Express
const cors = require("cors"); // Middleware pour autoriser les requêtes cross-origin
const dotenv = require("dotenv"); // dotenv pour gérer les variables d'environnement
dotenv.config(); // Chargez les variables d'environnement depuis le fichier .env

// Définir le port
const PORT = process.env.PORT || 5000;

// Configuration Brevo (Sendinblue)
const Sib = require("sib-api-v3-sdk"); // SDK Brevo
const client = Sib.ApiClient.instance; // Créez une instance de l'API
const apiKey = client.authentications["api-key"]; // Authentification par clé API
apiKey.apiKey = process.env.API_KEY; // Définir la clé API depuis les variables d'environnement

// Middleware
app.use(express.json()); // parse json body content
app.use(cors()); // Activer CORS pour toutes les routes

//==================Endpoints==================
app.post("/api", (req, res) => { 
  // Récupérer les données du corps de la requête envoyée par le client
  const { name, email,subject, message } = req.body; 
//Créer une instance de l'API des emails transactionnels
  const tranEmailApi = new Sib.TransactionalEmailsApi();  
  // Configurer l'email à envoyer via Brevo
  const sender = {
    email: "elobayidoumaima@gmail.com", //expediteur utilisé dans le compte Brevo.
    name: "Oumaima El obayid",
  };
  // Configurer le destinataire
  const receivers = [
    {
      email: email, //destinataire
    },
  ];
  // Envoyer l'email via l'API Brevo
  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: subject,
      htmlContent: message,
      params: {
        role: "Frontend",
      },
    })    
    .then(resp =>{ 
      // Envoyer la réponse JSON au client
      res.status(201).json({ msg: "message sent Successfuly" });
    })
    .catch(err=>console.log(err));
});

// ==================== SERVER ====================
app.listen(PORT, () => {
  console.log("server is listening on port 5000");
});
