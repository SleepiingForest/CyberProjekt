$(document).ready(function(){

    

    $('#nom').on('input',function(e){
        
    });

    $('#ajout_compte').on('submit', function(e){
        e.preventDefault();
        console.log('nom '+ $('#nom').val());
        console.log('nbCopies '+ $('#nb_copies').val());
        
        var nom = $('#nom').val();

        if(nom == "")
        {
            $('#retour_form').empty();
            $('#retour_form').hide();
            $('#retour_form').append("<font color='red'>Le Champs nom est obligatoire</font>");
            $('#retour_form').fadeIn('fast');
            return;
        }

        try {
            var nb_copies = eval($('#nb_copies').val());
        }
        catch(e)
        {
            $('#retour_form').empty();
            $('#retour_form').hide();
            $('#retour_form').append("<font color='red'>Le Champs Nombre de copies doit être un nombre ou une formule</font>");
            $('#retour_form').fadeIn('fast');
            return;
        }
        

        console.log('nbCopies2 '+nb_copies);
        
        
        $.post( "/ajout_compte", {
            nom : nom,
            nb_copies : nb_copies
        }, function( data ) {

           console.log("retour "+ data);
           $('#retour_form').empty();
           $('#retour_form').hide();
           $('#retour_form').append(data);
           $('#retour_form').fadeIn('fast');
          });
    });
});