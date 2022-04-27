var latitude_beginning
var latitude_arrival
var longitude_beginning
var longitude_arrival
var longitude_beginning_station
var longitude_arrival_station
var latitude_beginning_station
var latitude_arrival_station
var station_to_station_color_path = '#003cfc'


var map
var coords
var layers = []
var current_layers =[]
var total_duration = 0.0
var walking_duration =0.0
var layers_walking =[]
var current_walking_layers =[]
var isBeginning = true
var isFullWalking = false





map = new ol.Map({
    target: 'map', // <-- This is the id of the div in which the map will be built.
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],

    view: new ol.View({
        center: ol.proj.fromLonLat([6.178289, 48.690303]), // <-- Those are the GPS coordinates to center the map to.
        zoom: 13 // You can adjust the default zoom.
    })

});


async function findCoordinatesStreetMap(adress){
    const response = await fetch( 'https://api.openrouteservice.org/geocode/search/structured?api_key=5b3ce3597851110001cf62483c7e6c9cdcd642968bb2481efbf9316c&address='+ adress + '&country=france&locality=Nancy&size=1');
    var json = await response.json();
    var coordinates = [json.bbox[1] , json.bbox[0]];
    return coordinates;
}

function handlerClosetStation(){
    if (this.status !== 200) {
        console.log("Contracts not retrieved. Check the error in the Network or Console tab.");
    } else {
        console.log('arrival handler');
        str = this.responseText;
        let json = JSON.parse(str);
        console.log(json);
        if(!isBeginning){
            latitude_arrival_station = json.getClosestStationResult[0];
            longitude_arrival_station = json.getClosestStationResult[1];
        }else {
            latitude_beginning_station = json.getClosestStationResult[0];
            longitude_beginning_station = json.getClosestStationResult[1];
        }
    }
}

function requestAPI(handler, url){
    var caller = new XMLHttpRequest();
    caller.open('GET', url, false);
    caller.setRequestHeader ("Accept", "application/json");
    caller.onload=handler;
    caller.send();
}


function pathHandler(){
    if (this.status !== 200) {
        console.log("Contracts not retrieved. Check the error in the Network or Console tab.");
    } else {
        str = this.responseText;
        //handlejson
        str= str.replace('feature', 'Feature');
        str= str.replace('geometry', 'geom');
        str= str.replace('duration', 'duree');
        console.log(str);
        let json = JSON.parse(str);
        console.log(json.Features[0].geom.coordinates);
        coords = json.Features[0].geom.coordinates;

        if(!isFullWalking){
            total_duration += json.Features[0].properties.segments[0].duree;
        }
        else {
            walking_duration = json.Features[0].properties.segments[0].duree;
        }

        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat(coords[0]))

                    })
                ]
            })
        });

// Create an array containing the GPS positions you want to draw
        var lineString = new ol.geom.LineString(coords);

// Transform to EPSG:3857
        lineString.transform('EPSG:4326', 'EPSG:3857');

// Create the feature
        var feature = new ol.Feature({
            geometry: lineString,
            name: 'Line'
        });

// Configure the style of the line
        var lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: station_to_station_color_path,
                width: 2
            })
        });

        var source = new ol.source.Vector({
            features: [feature]
        });

        var vector = new ol.layer.Vector({
            source: source,
            style: [lineStyle]
        });

        if(isFullWalking){
            layers_walking.push(vector);
        }else{
            layers.push(vector);
            layers.push(layer);
        }

    }
}


async function wait(waiting_time){
    await new Promise(r => setTimeout(r, waiting_time));
}


async function markBeginning() {


    var departureAdress = document.getElementById("debut").value;
    var arrivalAdress = document.getElementById("fin").value;
    var departure_coordinates = await findCoordinatesStreetMap(departureAdress);
    var arrival_coordinates = await findCoordinatesStreetMap(arrivalAdress);



    latitude_beginning = parseFloat(departure_coordinates[0]);
    longitude_beginning = parseFloat(departure_coordinates[1]);

    latitude_arrival = parseFloat(arrival_coordinates[0]);
    longitude_arrival = parseFloat(arrival_coordinates[1]);



    var url_departure = 'http://localhost:8736/Design_Time_Addresses/RoutingService/ServiceHttp/getClosestStation?lat=' + departure_coordinates[0] + '&long=' + departure_coordinates[1]+ '&arrival=false';
    var url_arrival = 'http://localhost:8736/Design_Time_Addresses/RoutingService/ServiceHttp/getClosestStation?lat=' + arrival_coordinates[0] + '&long=' + arrival_coordinates[1]+ '&arrival=true';

    requestAPI(handlerClosetStation, url_departure);
    isBeginning = false
    requestAPI(handlerClosetStation, url_arrival);
    wait(1000);

    const url_getPath_departure_station = 'http://localhost:8736/Design_Time_Addresses/RoutingService/ServiceHttp/getWalkingPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+longitude_beginning_station+'&long2='+latitude_beginning_station;
    const url_getPath_station_station = 'http://localhost:8736/Design_Time_Addresses/RoutingService/ServiceHttp/getCyclingPath?lat1='+longitude_beginning_station+'&long1='+latitude_beginning_station+'&lat2='+longitude_arrival_station+'&long2='+latitude_arrival_station;
    const url_getPath_station_arrival = 'http://localhost:8736/Design_Time_Addresses/RoutingService/ServiceHttp/getWalkingPath?lat1='+longitude_arrival_station+'&long1='+latitude_arrival_station+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];
    const url_getPath_full_walk = 'http://localhost:8736/Design_Time_Addresses/RoutingService/ServiceHttp/getWalkingPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];



    requestAPI(pathHandler, url_getPath_departure_station);
    wait(600);

    station_to_station_color_path = '#ec4545';
    requestAPI(pathHandler, url_getPath_station_station);
    wait(600);

    station_to_station_color_path = '#006dff';

    requestAPI(pathHandler, url_getPath_station_arrival);
    wait(600);

    isFullWalking = true;

    requestAPI(pathHandler, url_getPath_full_walk);
    wait(600);

    markPathOnMap();

    }

    function markPathOnMap(){


        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({

                        geometry: new ol.geom.Point(ol.proj.fromLonLat([ longitude_arrival,latitude_arrival]))
                    }),
                    new ol.Feature({

                        geometry: new ol.geom.Point(ol.proj.fromLonLat([ longitude_beginning, latitude_beginning]))
                    })
                ]
            })
        });

        layers.push(layer);
        layers_walking.push(layer);

        if(layers !== current_layers  || layers_walking !== current_walking_layers){
            for (let i = 0; i < current_layers.length; i++) {
                map.removeLayer(current_layers[i]);
            }
            for (let i = 0; i < current_walking_layers.length; i++) {
                map.removeLayer(current_walking_layers[i]);
            }

            while(current_layers.length !==0){current_layers.pop();}
            while(current_walking_layers.length !==0){current_walking_layers.pop();}

            console.log('time duration with bike : ' + total_duration + 'versus only walk : ' + walking_duration);

            if(walking_duration<total_duration){
                console.log('ONLY WALK');
                for (let i = 0; i < layers_walking.length; i++) {
                    current_walking_layers[i] = layers_walking[i];
                    map.addLayer(current_walking_layers[i]);
                }
            } else {
                for (let i = 0; i < layers.length; i++) {
                    current_layers[i] = layers[i];
                    map.addLayer(current_layers[i]);
                }
            }

            while(layers.length !==0){layers.pop();}
            while(layers_walking.length !==0){layers_walking.pop();}

            total_duration = 0
            walking_duration = 0
            isFullWalking = false
    }



}







