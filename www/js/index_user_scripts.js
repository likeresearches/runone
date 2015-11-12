    
var map;
function initMap(arrayDist) {
    map = new google.maps.Map(document.getElementById("map"), { 
        center: new google.maps.LatLng(-12.96274, -38.4346),
        zoom: 17
    });
    
    putMarker(arrayDist);
                                                
}

function putMarker(arrayDist){
    map.setCenter(new google.maps.LatLng(arrayDist[0].latitude, arrayDist[0].longitude));
    for (var x in arrayDist){
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(arrayDist[x].latitude, arrayDist[x].longitude),
          map: map,
          //title: arrayDist[x].user,
          visible: true
      });
      
      var infowindow = new google.maps.InfoWindow({
        content: arrayDist[x].distancia
      });
  
                                              
      infowindow.open(map,marker);
      
    }
}


function calcTime(arrayPoints, index){
    var velRelativa = Number(arrayPoints[0].speed) - Number(arrayPoints[index].speed);
    var tempo = ((Number(arrayPoints[index].value)/1000) / velRelativa)*60;   
    return Math.round(tempo);
}

function requestGroupPosition(){
    //var URL = 'http://localhost:3000/track';
    var URL = 'http://tccapp.heroku.com/track';
    var data = {user:intel.xdk.device.uuid};
    var frente = document.getElementById('itemFrente');
    var atras = document.getElementById('itemAtras');
         
    //JSON request for API
    $.getJSON(URL, data, function(arrayPoints){
        alert("Request OK " + JSON.stringify(arrayPoints));
        initMap(arrayPoints);
        frente.textContent = arrayPoints[1].user +" - "+ arrayPoints[1].value+" m"+" - "+calcTime(arrayPoints,1)+" min";
        atras.textContent = arrayPoints[2].user+" - "+arrayPoints[2].value+" m"+" - "+calcTime(arrayPoints,2)+" min";
    });    
}

function watchTimer(){
    
    var options = {timeout:20000, maximumAge: 10000, enableHighAccuracy: true};

    var fail = function(){
        alert("Geolocation Failed");
    };

    var suc = function(position){
        //Gravar dados da posição capturada em uma variável
        var coords = position.coords;
        //alert(JSON.stringify(coords));
            
        //var arrayDist; 
            
        var URL = 'http://tccapp.herokuapp.com/';
        //var URL = 'http://localhost:3000/';

        //JSON post for API
        $.ajax({ 
            type: "POST",
            url: URL+"track",
            dataType: 'json',
            contentType: 'application/json',
            crossDomain: true,
            processData: false,
            data: JSON.stringify({"user":intel.xdk.device.uuid,
                                  "status":"live",
                                  "latitude": coords.latitude,
                                  "longitude": coords.longitude,
                                  "speed": coords.speed,
                                  "heading": coords.heading,
                                  })
        });
            
    };
    
   
    var geolocationWatchTimer = navigator.geolocation.watchPosition(suc,fail,options);
    
}

/* button  #btnGPS */
$(document).on("click", "#btnGPS", function(evt)
{
     setInterval(requestGroupPosition,10000);
        
});


document.addEventListener("deviceready",function(){
    watchTimer();
    //initMap();
}, false);
//document.addEventListener("app.Ready", register_event_handlers, false);
