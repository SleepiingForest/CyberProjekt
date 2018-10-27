function testSpecialChar(chaine) {
    var reg = /^[a-zA-Z0-9-\s]+$/gi
    //alert(reg.test(chaine))
    return reg.test(chaine);
}


//Recupérer l'historique recent (global)

function afficherHistoriqueGlobal() {

    $.get("/historiqueGlobal", {

    }, function (data) {
        $('#table_comptes').empty();
        //console.log("retour historique " + data);
        $('#table_historique').empty();
        data.forEach(row => {

            //Traitement type Action
            var type_action = '';
            if(row.type_action == 1)
            {
                type_action = 'Création de compte';
            }
            else if (row.type_action == 2)
            {
                type_action = 'Ajout/Retrait de copie(s)';
            }

            //Traitement Date 
            var parsedDate = new Date(row.date_action);

            var month = parsedDate.getMonth() + 1;
            var day = parsedDate.getDate();
            var year = parsedDate.getFullYear();
            var jourSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
            "Dimanche"][parsedDate.getDay() - 1];
            var heures = parsedDate.getHours();
            var minutes = parsedDate.getMinutes();
            console.log('month : '+month+' day '+day+'year '+year);
            if(month < 10)
            {
                var tmpMonth = month;
                month = "0" + tmpMonth;
            }

            if(day < 10)
            {
                var tmpDay = day;
                day = "0" + tmpDay;
            }

            $('#table_historique').append('<tr><td>'
            +jourSemaine+' '+day+'/'+month+'/'+year+' à '+heures+':'+minutes+'</td>' 
            +'<td><div class="dropdown">' 
                +'<a href="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                +row.nom_comptes
                +'</a>'
                +'<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'
                  +  '<a href="#" id="'+row.nom_comptes+'" class="dropdown-item openModifPopup">Ajouter/Enlever unités</a>'
                  +  '<a href="#" id="'+row.nom_comptes+'" class="dropdown-item openDetailsPopup">Détails</a>'
                  +  '<a href="#" id="'+row.nom_comptes+'" class="dropdown-item openSupprimerPopup">Modifier/Supprimer</a>'
              +  '</div></td>'
           + '</div>'
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
                +'<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'
                  +  '<a href="#" id="'+row.nom+'" class="dropdown-item openModifPopup">Ajouter/Enlever unités</a>'
                  +  '<a href="#" id="'+row.nom+'" class="dropdown-item openDetailsPopup">Détails</a>'
                  +  '<a href="#" id="'+row.nom+'" class="dropdown-item openSupprimerPopup">Modifier/Supprimer</a>'
              +  '</div>'
           + '</div>'
           + '</td>'
           + '</td><td id="'+row.nom+'nbCopies">' + row.nb_copies + '</td><td></td></tr>');



        });
    });

}

function afficherComptesByName(nom) {
    console.log(nom);
    if(nom == "")
    {
        afficherComptes();
        return;
    }

    if (testSpecialChar(nom)) {
        $.get("/comptesByName", { nom: nom }, function (data) {
            $('#table_comptes').empty();
            //console.log("retour " + data);
            data.forEach(row => {

                //$('#table_comptes').append('<tr><td>' + row.nom + '</td><td>' + row.nb_copies + '</td><td></td></tr>');
                $('#table_comptes').append('<tr><td>' 
            +'<div class="dropdown">' 
                +'<a href="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                +row.nom
                +'</a>'
                +'<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'
                  +  '<a href="#" id="'+row.nom+'" class="dropdown-item openModifPopup">Ajouter/Enlever unités</a>'
                  +  '<a href="#" id="'+row.nom+'" class="dropdown-item openDetailsPopup">Détails</a>'
                  +  '<a href="#" id="'+row.nom+'" class="dropdown-item openSupprimerPopup">Modifier/Supprimer</a>'
              +  '</div>'
           + '</div>'
           + '</td>'
           + '</td><td id="'+row.nom+'nbCopies">' + row.nb_copies + '</td><td></td></tr>');





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
    console.log($('#recherche_compte').val());
    afficherComptesByName($('#recherche_compte').val());
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
        //console.log($('#recherche_compte').val());
        afficherComptesByName($('#recherche_compte').val());
    });

    

    //Gestion de la popup de modification du nombre de copies
    
    $('#popupModifCopieNbModif').on('input', function (e) {

        nbCopies = $('#popupModifCopieNbRestantHide').html();
        inputNb = $(this).val();
        var newNb = nbCopies;
        if($(this).val() == "")
        {
            inputNb = 0;
        }
        try{
            newNb = eval( nbCopies +"+"+ inputNb);
        }
        catch(e){
            return;
        }
        $('#popupModifCopieNbRestant').empty();
        $('#popupModifCopieNbRestant').append(newNb);
    });

    $(document).on('click', '.openModifPopup',function(){ 
        $('#popupModifCopieNomCompte').empty();
        $('#popupModifCopieNbRestant').empty();
        $('#popupModifCopieNbRestantHide').empty();
        $('#popupModifCopieNomCompteHide').empty();

        console.log($(this).attr("id"));
       $('#popupModifCopieNomCompte').append('<b>'+$(this).attr("id")+'</b>');

        //Recup des infos comptes
        nbCopies = "[id='"+$(this).attr('id')+"nbCopies']";
        $('#popupModifCopieNbRestant').append($(nbCopies).html());
        $('#popupModifCopieNbRestantHide').append($(nbCopies).html());
        $('#popupModifCopieNomCompteHide').append($(this).attr("id"));
        $('#popupModifCopie').show();      
    });
    
    $(document).on('click', '#popupModifCopieClose',function(){ 
        $('#popupModifCopieNbModif').val('');
        $('#popupModifCopie').hide();      
    });

    $(document).on('click', '#popupCloseArrow',function(){ 
        $('#popupModifCopieNbModif').val('');
        $('#popupModifCopie').hide();      
    });

    //Sauvegarde de la modification dans la base
    $(document).on('click', '#popupModifCopieSave',function(){ 

        var nb_copies = $('#popupModifCopieNbModif').val();
        var nom =  $('#popupModifCopieNomCompteHide').html();
        

        try{
            var nb_copies_eval = eval(nb_copies);



            var new_nb_copies_eval = eval($('#popupModifCopieNbRestantHide').html() +"+"+ nb_copies_eval);

            $.post("/modiferNbCopies", {
                nom: nom,
                nb_copies: nb_copies,
                nb_copies_eval: nb_copies_eval,
                new_nb_copies_eval: new_nb_copies_eval

            }, function (data) {
    
                $('#popupModifCopieNbModif').val('');
                $('#popupModifCopie').hide();  

            });
            

        }
        catch(e){
            alert(e);
            return;
        }
        afficherPage();
    });

});

