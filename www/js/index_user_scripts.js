
var user;
var map;

var baseURL = 'http://tccapp.heroku.com/';
//var baseURL = 'http://localhost:3000/';

/*global $ */(function()
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
           
            setTimeout(function a(){ 
                requestGroupPosition();
                setTimeout(a,10000);
            },10000);

        });
    
        /* button  #btnIniciar */
    $(document).on("click", "#btnIniciar", function(evt)
    {
        user = document.getElementById("txtUser").value;
        watchTimer();
    });
    
    }
    
    
    
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
        var URL = baseURL+"track";
        var data = {user:user};
        var frente = document.getElementById('itemFrente');
        var atras = document.getElementById('itemAtras');

        //JSON request for API
        $.getJSON(URL, data, function(arrayPoints){
            
            initMap(arrayPoints);
            arrayPoints = arrayPoints.sort(function(a,b){
                if(a.value > b.value){
                    return 1;
                }
                if(a.value < b.value){
                    return -1;
                }
                return 0;
            })
            alert("Request OK " + JSON.stringify(arrayPoints));
            frente.textContent = arrayPoints[1].user +" - "+ arrayPoints[1].value+" m"+" - "+calcTime(arrayPoints,1)+" min";
            atras.textContent = arrayPoints[2].user+" - "+arrayPoints[2].value+" m"+" - "+calcTime(arrayPoints,2)+" min";
        });    
    }

    function watchTimer(){
        var options = {maximumAge: 0,enableHighAccuracy: true};

        var fail = function(){
            alert("Geolocation Failed");
        };

        var suc = function(position){
            //Gravar dados da posição capturada em uma variável
            var coords = position.coords;
            //alert(JSON.stringify(coords));
            var myUrl = 'http://tccapp.herokuapp.com/track';
            
            //JSON post for API
            $.ajax({ 
                type: "POST",
                url: myUrl,
                dataType: 'json',
                contentType: 'application/json',
                crossDomain: true,
                processData: false,
                data: JSON.stringify({"user":user,
                                      "status":"live",
                                      "latitude": coords.latitude,
                                      "longitude": coords.longitude,
                                      "speed": coords.speed,
                                      "heading": coords.heading,
                                      }),
                success: function(data){},
                error: function(data){alert("Erro",data);}
            });
            

        };


        var geolocationWatchTimer = navigator.geolocation.watchPosition(suc,fail,options);

    }

    document.addEventListener("app.Ready", register_event_handlers, false);
  
//    document.addEventListener("deviceready",function(){
//        watchTimer();
//    }, false);
//    
})();










