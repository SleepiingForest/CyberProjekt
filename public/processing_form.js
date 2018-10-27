function testSpecialChar(chaine) {
    var reg = /^[a-zA-Z0-9]+$/gi
    //alert(reg.test(chaine))
    return reg.test(chaine);
}


//Recupérer l'historique recent (global)

function afficherHistoriqueGlobal() {

    $.get("/historiqueGlobal", {

    }, function (data) {
        $('#table_comptes').empty();
        console.log("retour historique " + data);
        $('#table_historique').empty();
        data.forEach(row => {
            var type_action = '';
            if(row.type_action == 1)
            {
                type_action = 'Création de compte';
            }
            else if (row.type_action == 2)
            {
                type_action = 'Ajout/Retrait de copie(s)';
            }

            $('#table_historique').append('<tr><td>'
            +row.date_action+'</td>' 
            +'<td><div class="dropdown">' 
                +'<a href="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                +row.nom_comptes
                +'</a>'
                +'<div class="dropdown-menu infoBox" aria-labelledby="dropdownMenuButton">'
                  +  '<div class="dropdown-item infoBox">Action</div>'
              +  '</div>'
           + '</div>'
           + '</td>'
           + '</td><td>'+type_action+'</td><td>' + row.nb_copies + '</td><td>'+row.detail_action+'</td></tr>');

        });
    });

}

//Pour récupérer tous les comptes et les afficher
function afficherComptes() {

    $.get("/comptes", {

    }, function (data) {
        $('#table_comptes').empty();
        console.log("retour " + data);
        data.forEach(row => {

            //$('#table_comptes').append('<tr><td>' + row.nom + '</td><td>' + row.nb_copies + '</td><td></td></tr>');

            $('#table_comptes').append('<tr><td>' 
            +'<div class="dropdown">' 
                +'<a href="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                +row.nom
                +'</a>'
                +'<div class="dropdown-menu infoBox" aria-labelledby="dropdownMenuButton">'
                  +  '<div class="dropdown-item infoBox">Action</div>'
              +  '</div>'
           + '</div>'
           + '</td>'
           + '</td><td>' + row.nb_copies + '</td><td></td></tr>');

        });
    });

}

function afficherComptesByName(nom) {
    console.log(nom);
    if (testSpecialChar(nom)) {
        $.get("/comptesByName", { nom: nom }, function (data) {
            $('#table_comptes').empty();
            console.log("retour " + data);
            data.forEach(row => {

                //$('#table_comptes').append('<tr><td>' + row.nom + '</td><td>' + row.nb_copies + '</td><td></td></tr>');
                $('#table_comptes').append('<tr><td>' 
            +'<div class="dropdown">' 
                +'<a href="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                +row.nom
                +'</a>'
                +'<div class="dropdown-menu infoBox" aria-labelledby="dropdownMenuButton">'
                  +  '<div class="dropdown-item infoBox">Action</div>'
              +  '</div>'
           + '</div>'
           + '</td>'
           + '</td><td>' + row.nb_copies + '</td><td></td></tr>');





            });
        });
        $('#retour_form_recherche').empty();
        $('#retour_form_recherche').hide();

    }
    else {
        $('#retour_form_recherche').empty();
        $('#retour_form_recherche').hide();
        $('#retour_form_recherche').append("<font color='red'>Le Champs Recherche n'accepte pas les caractères spéciaux</font>");
        $('#retour_form_recherche').fadeIn('fast');

    }

}

function afficherPage()
{
    afficherHistoriqueGlobal();
    afficherComptes();
}

$(document).ready(function () {
    //affichage des comptes
   
    afficherPage();



    //Formulaire d'ajout
    $('#ajout_compte').on('submit', function (e) {
        e.preventDefault();
        console.log('nom ' + $('#nom').val());
        console.log('nbCopies ' + $('#nb_copies').val());

        var nom = $('#nom').val();

        if (nom == "") {
            $('#retour_form').empty();
            $('#retour_form').hide();
            $('#retour_form').append("<font color='red'>Le Champs nom est obligatoire</font>");
            $('#retour_form').fadeIn('fast');
            return;
        }

        if (!testSpecialChar(nom)) {
            $('#retour_form').empty();
            $('#retour_form').hide();
            $('#retour_form').append("<font color='red'>Le Champs nom n'accepte pas les caractères spéciaux</font>");
            $('#retour_form').fadeIn('fast');
            return;
        }

        try {
            var detail_action = $('#nb_copies').val().replace(/\s/g, ""); //On enlève les espaces
            var nb_copies = eval($('#nb_copies').val());
        }
        catch (e) {
            $('#retour_form').empty();
            $('#retour_form').hide();
            $('#retour_form').append("<font color='red'>Le Champs Nombre de copies doit être un nombre ou une formule</font>");
            $('#retour_form').fadeIn('fast');
            return;
        }


        console.log('nbCopies2 ' + nb_copies);


        $.post("/ajout_compte", {
            nom: nom,
            nb_copies: nb_copies,
            detail_action: detail_action
        }, function (data) {

            console.log("retour " + data);
            $('#retour_form').empty();
            $('#retour_form').hide();
            $('#retour_form').append(data);
            $('#retour_form').fadeIn('fast');
            afficherPage();
        });
    });


    //FORM RECHERCHE COMPTES
    $('#recherche_compte').on('input', function (e) {
        console.log($('#recherche_compte').val());
        afficherComptesByName($('#recherche_compte').val());
    });

    $(".infoBox").click(function(event){
        alert("hello");
        event.preventDefault();
    });
});

