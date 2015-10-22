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
            
            var arrayDist; 
            
            //var URL = 'http://tccapp.herokuapp.com/';
            var URL = 'http://localhost:3000/';
            
            //JSON request for API
            $.getJSON(URL, function(data){
                //alert("Request OK " + JSON.stringify(data));
            });
            
            //JSON post for API
            $.ajax({ 
                type: "POST",
                url: URL+"track",
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: true,
                processData: false,
                data: JSON.stringify({"user":"Jobs",
                                      "status":"live",
                                      "latitude":coords.latitude,
                                      "longitude":coords.longitude,
                                      }),
                success: function (msg) {
                    var arrayDist = msg;
                    alert("Distância = " + JSON.stringify(msg));
                    $("#txtLatitude").val(arrayDist[0].user);
                    initMap(arrayDist);
                }
            });
           
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


var map;
function initMap(arrayDist) {
  map = new google.maps.Map(document.getElementById("map"), { 
    center: new google.maps.LatLng(arrayDist[0].latitude, arrayDist[0].longitude),
    zoom: 15
  });
    
  for (x in arrayDist){
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(arrayDist[x].latitude, arrayDist[x].longitude),
          map: map,
          title: arrayDist[x].user,
          visible: true
      });
      var infowindow = new google.maps.InfoWindow({
        content: arrayDist[x].user.concat(arrayDist[x].distancia)
      });
  
                                              
  infowindow.open(map,marker);
      
  }
                                                
}

