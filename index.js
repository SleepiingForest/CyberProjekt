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
  //console.log('Connected to the cyber database.');
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
  db.run('CREATE TABLE IF NOT EXISTS actions (id_action INTEGER PRIMARY KEY,date_action DATE,nb_copies INTEGER, nb_copies_couleurs INTEGER,type_action INTEGER,detail_action VARCHAR(50),nom_comptes VARCHAR(50),FOREIGN KEY (nom_comptes) REFERENCES comptes (nom));');
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
  var detail_action = req.body.detail_action;

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
    //console.log('Connected to the cyber database.');
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

        //Ajout à la table Comptes
        sql = "INSERT INTO comptes(nom,nb_copies,date_creation) VALUES('" + nom + "','" + nb_copies + "','"+date+"')";
        console.log(sql);
        db.run(sql, [], function (err) {
          if (err) {
            return console.log(err.message);
          }
          
        });

        //Ajout d'une action à la table Actions
        //type_action : 1 creation compte, 2 ajout ou retrait
        sql = "INSERT INTO actions(date_action,nb_copies,type_action,detail_action,nom_comptes) VALUES('" + date + "','" + nb_copies + "','1','" + detail_action + "','" + nom + "')";
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
  console.log('GetComptes');
  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
   // console.log('Connected to the cyber database.');
  });
  var sql = "SELECT * FROM comptes ORDER BY nom asc;"
  db.all(sql,[],function (err, rows ) {
    res.send(rows);
  });
  db.close();
})

//                                                            FIN RECUPERER TOUT LES COMPTES

//                                                            DEBUT RECUPERER COMPTES BY NAME

app.get('/comptesByName', function (req, res) {
  console.log('GetComptesByName');
  var nom = req.query.nom;
  console.log(nom);
  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    //console.log('Connected to the cyber database.');
  });
  var sql = "SELECT * FROM comptes WHERE nom like '%"+nom+"%' ORDER BY nom asc;"
  db.all(sql,[],function (err, rows ) {
    res.send(rows);
  });
  db.close();
})

//                                                            FIN RECUPERER COMPTES BY NAME
//                                                            DEBUT RECUPERER UN COMPTE BY NAME
app.get('/compteByName', function (req, res) {
  console.log('GetComptesByName');
  var nom = req.query.nom;
  console.log(nom);
  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    //console.log('Connected to the cyber database.');
  });
  var sql = "SELECT * FROM comptes WHERE nom like '"+nom+"';"
  db.all(sql,[],function (err, rows ) {
    res.send(rows);
  });
  db.close();
})
//                                                            FIN RECUPERER UN COMPTE BY NAME

//                                                            DEBUT HISTORIQUE GLOBAL
app.get('/historiqueGlobal', function (req, res) {
  console.log('GetHistorique');
  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    //console.log('Connected to the cyber database.');
  });
  var sql = "SELECT * FROM actions ORDER BY date_action desc LIMIT 10;"
  db.all(sql,[],function (err, rows ) {
    res.send(rows);
  });
  db.close();
})
//                                                            FIN HISTOTRIQUE GLOBAL
//                                                            DEBUT MODIFIER NOMBRE COPIES
app.post('/modiferNbCopies', function (req, res) {
  console.log('modiferNbCopies');
  //Ouverture Db
  let db = new sqlite3.Database('./Database/cyber.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    //console.log('Connected to the cyber database.');
  });
  date = new Date();
  nb_copies = req.body.nb_copies_eval;
  detail_action = req.body.nb_copies;
  new_nb_copies = req.body.new_nb_copies_eval;
  nom = req.body.nom;

  console.log(nb_copies+' '+detail_action+' '+new_nb_copies+ ' '+nom);
  //TABLE ACTIONS
  sql = "INSERT INTO actions(date_action,nb_copies,type_action,detail_action,nom_comptes) VALUES('" + date + "','" + nb_copies + "','2','" + detail_action + "','" + nom + "')";      
  db.run(sql, [], function (err) {
    if (err) {
      return console.log(err.message);
    }
    
  });

  //TABLES COMPTES
  sql = "UPDATE comptes SET nb_copies = '"+new_nb_copies+"' WHERE nom = '"+nom+"'";      
  db.run(sql, [], function (err) {
    if (err) {
      return console.log(err.message);
    }
    
  });

  db.close();
})
//                                                            FIN MODIFIER NOMBRE COPIES
app.listen(3000, function () {
  console.log('Cyber app listening on port 3000!');
})


