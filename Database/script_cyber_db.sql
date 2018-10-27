CREATE TABLE IF NOT EXISTS comptes (
 nom VARCHAR(50),
 nb_copies INTEGER,
 date_creation DATE,
 PRIMARY KEY (nom)
);

CREATE TABLE IF NOT EXISTS actions (
 id_action INTEGER PRIMARY KEY,
 date_action DATE,
 nb_copies_nb INTEGER,
 nb_copies_couleurs INTEGER,
 type_action INTEGER,
 detail_action VARCHAR(50),
 nom_comptes VARCHAR(50),
 FOREIGN KEY (nom_comptes) REFERENCES comptes (nom)
);
