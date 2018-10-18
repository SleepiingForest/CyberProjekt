const express = require('express')
const app = express()
var path = require('path');
var publicDir = '/public';
app.use(express.static('public'));
app.use(publicDir, express.static('public'));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


//Database
var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./Database/cyber.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the cyber database.');
});


//Running database script
//fs = require('fs')
//fs.readFile('./Database/script_cyber_db.sql', 'utf8', function (err,data) {
//if (err) {
//return console.log(err);
//}

db.serialize(function () {
  //console.log(data);
  db.run('CREATE TABLE IF NOT EXISTS comptes (nom VARCHAR(50),nb_copies INTEGER,date_creation DATE,PRIMARY KEY (nom));');
  db.run('CREATE TABLE IF NOT EXISTS actions (id_action INTEGER PRIMARY KEY,date_action DATE,nb_copie INTEGER,type_action INTEGER,nom_comptes VARCHAR(50),FOREIGN KEY (nom_comptes) REFERENCES comptes (nom));');
  console.log("Cyber database Created");
  db.close();
});
//});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, publicDir, 'index.html'));
})



//                                                           DEBUT AJOUT DE COMPTES
app.post('/ajout_compte', function (req, res) {
  console.log("ajout compte");
  var nom = req.body.nom;
  var nb_copies = req.body.nb_copies;

  if(typeof nb_copies ==="undefined")
  {
    nb_copies = 0;
  }
  console.log("ajout dans la base de : ");
  console.log(nom);
  console.log(nb_copies);

  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the cyber database.');
  });

  db.serialize(function () {

    //On vérifie si  pk ok
    var sql = "SELECT nom from comptes where nom = '" + nom + "'";
    db.get(sql, [], function (err, row) {
      if (err) {
        return console.log(err.message);
      }
     
      //Si oui go
      if (typeof row === "undefined") {

        var date = new Date();
        sql = "INSERT INTO comptes(nom,nb_copies,date_creation) VALUES('" + nom + "','" + nb_copies + "','"+date+"')";
        console.log(sql);
        db.run(sql, [], function (err) {
          if (err) {
            return console.log(err.message);
          }
          
        });
        db.close();
        res.send("<font color='green'>Utilisateur "+nom+" ajouté avec " + nb_copies+" copies.</font>");
      }
      
      else {
        db.close();
        console.log("deja present");
        res.send("<font color='red'>Ce nom d'utilisateur est déjà utilisé.</font>");
      }


    });

  });
})
//                                                            FIN AJOUT DE COMPTES


//                                                            DEBUT RECUPERER TOUT LES COMPTES

app.get('/comptes', function (req, res) {
  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the cyber database.');
  });
  var sql = "SELECT * FROM comptes;"
  db.all(sql,[],function (err, rows ) {
    res.send(rows);
  });
  db.close();
})

//                                                            FIN RECUPERER TOUT LES COMPTES

app.listen(3000, function () {
  console.log('Cyber app listening on port 3000!');
})


