CREATE TABLE IF NOT EXISTS comptes (
 nom VARCHAR(50),
 nb_copies INTEGER,
 date_creation DATE,
 PRIMARY KEY (nom)
);

CREATE TABLE IF NOT EXISTS actions (
 id_action INTEGER PRIMARY KEY,
 date_action DATE,
 nb_copie INTEGER,
 type_action INTEGER,
 nom_comptes VARCHAR(50),
 FOREIGN KEY (nom_comptes) REFERENCES comptes (nom)
);
