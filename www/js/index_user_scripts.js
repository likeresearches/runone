(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  #btnGPS */
    $(document).on("click", "#btnGPS", function(evt)
    {
        //Resultado para quando capturar a posição GPS
        var fnCapturar = function aoCapturar(position){
            
            //Gravar dados da posição capturada em uma variável
            var coords = position.coords;
            
            var URL = 'http://tccapp.herokuapp.com/';
            
            //JSON request for API
            $.getJSON(URL, function(data){
                alert("Request OK " + JSON.stringify(data));
            });
            
            //JSON post for API
            $.ajax({ 
                type: "POST",
                url: URL+"track",
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: true,
                processData: false,
                data: JSON.stringify({"latitude":coords.latitude,
                                      "longitude":coords.longitude,
                                      "heading":coords.heading,
                                      "accuracy":coords.accuracy}),
                sucess: function (msg) {
                    alert("Post Ok" + msg);
                }
            });
            
            

            //Exibir dados das coordenadas capturadas
            //navigator.notification.alert(JSON.stringify(coords),"COORDENADAS");
            $("#txtLatitude").val(coords.latitude);
            $("#txtLongitude").val(coords.longitude);
            $("#txtAccuracy").val(coords.accuracy);
            $("#txtAltitude").val(coords.altitude);
            $("#txtHeading").val(coords.heading);
            $("#txtSpeed").val(coords.speed);
            $("#txtAltitudeAcc").val(coords.altitudeAccuracy);
        };
        
        
        
        var fnFalhar = function(error){
            navigator.notification.alert("Erro ao capturar: "+ error.message, "INFORMARÇAO");
        };
        
        var opcoes = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
        
        navigator.geolocation.getCurrentPosition(fnCapturar, fnFalhar, opcoes);
        
    });
    
 }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
