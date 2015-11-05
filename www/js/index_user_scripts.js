



 
       
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
          //title: arrayDist[x].user,
          visible: true
      });
      var infowindow = new google.maps.InfoWindow({
        content: arrayDist[x].distancia
      });
  
                                              
  infowindow.open(map,marker);
      
  }
                                                
}


function requestGroupPosition(){
    var URL = 'http://localhost:3000/';
            
    //JSON request for API
    $.getJSON(URL, function(data){
        alert("Request OK " + JSON.stringify(data));
        initMap(data);
    });
}

function watchTimer(){

    var options = {timeout:20000, maximumAge: 1, enableHighAccuracy: true};

    var fail = function(){
        alert("Geolocation Failed");
    }

    var suc = function(position){
        //Gravar dados da posição capturada em uma variável
            var coords = position.coords;
            
            var arrayDist; 
            
            //var URL = 'http://tccapp.herokuapp.com/';
            var URL = 'http://localhost:3000/';
            
            //JSON post for API
            $.ajax({ 
                type: "POST",
                url: URL+"track",
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: true,
                processData: false,
                data: JSON.stringify({"user":Math.random(),
                                      "status":"live",
                                      "latitude":coords.latitude,
                                      "longitude":coords.longitude,
                                      })
//                success: function (msg) {
//                    alert(JSON.stringify(msg));
//                }
            });
    }

    var geolocationWatchTimer = intel.xdk.geolocation.watchPosition(suc,fail,options);
}

/* button  #btnGPS */
$(document).on("click", "#btnGPS", function(evt)
{
     requestGroupPosition();
        
});


document.addEventListener("deviceready",watchTimer(), false);
//document.addEventListener("app.Ready", register_event_handlers, false);
