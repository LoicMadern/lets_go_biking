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
function handlerDeparture() {
    if (this.status !== 200) {
        console.log("Contracts not retrieved. Check the error in the Network or Console tab.");
    } else {
        console.log('departure handler');
        // The result is contained in "this.responseText". First step: transform it into a js object.
        str = this.responseText;
        console.log(str);
        let json = JSON.parse(str);
        console.log(json);
        latitude_beginning_station = json.getClosestStationResult[0];
        longitude_beginning_station = json.getClosestStationResult[1];
    }
}

function handlerArrival() {

    if (this.status !== 200) {
        console.log("Contracts not retrieved. Check the error in the Network or Console tab.");
    } else {
        console.log('arrival handler');
        // The result is contained in "this.responseText". First step: transform it into a js object.
        str = this.responseText;
        let json = JSON.parse(str);
        console.log(json);
        latitude_arrival_station = json.getClosestStationResult[0];
        longitude_arrival_station = json.getClosestStationResult[1];
    }
}





function finishHandler(){
    if (this.status !== 200) {
        console.log("Contracts not retrieved. Check the error in the Network or Console tab.");
    } else {
        // The result is contained in "this.responseText". First step: transform it into a js object.
        str = this.responseText;
        str= str.replace('feature', 'Feature');
        str= str.replace('geometry', 'geom');
        str= str.replace('duration', 'duree');
        console.log(str);
        let json = JSON.parse(str);
        console.log(json.Features[0].geom.coordinates);
        coords = json.Features[0].geom.coordinates;
        total_duration += json.Features[0].properties.segments[0].duree;
        console.log('DISTANCE' + total_duration);
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat(coords[0]))
                    })
                ]
            })
        });
        layers.push(layer);


// Create an array containing the GPS positions you want to draw
//coords = [[7.0985774, 43.6365619], [7.1682519, 43.67163]];
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

        layers.push(vector);


    }
}


function finishHandlerWalking(){
    if (this.status !== 200) {
        console.log("Contracts not retrieved. Check the error in the Network or Console tab.");
    } else {
        // The result is contained in "this.responseText". First step: transform it into a js object.
        str = this.responseText;
        str= str.replace('feature', 'Feature');
        str= str.replace('geometry', 'geom');
        str= str.replace('duration', 'duree');
        console.log(str);
        let json = JSON.parse(str);
        console.log(json.Features[0].geom.coordinates);
        coords = json.Features[0].geom.coordinates;
        walking_duration = json.Features[0].properties.segments[0].duree;



// Create an array containing the GPS positions you want to draw
//coords = [[7.0985774, 43.6365619], [7.1682519, 43.67163]];
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

        layers_walking.push(vector);


    }
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


    var url_departure = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getClosestStation?lat=' + departure_coordinates[0] + '&long=' + departure_coordinates[1];
    var url_arrival = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getClosestStation?lat=' + arrival_coordinates[0] + '&long=' + arrival_coordinates[1];
    console.log(url_departure);
    console.log(url_arrival);


    /*
    const response = await fetch('http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getClosestStation?lat=' + departure_coordinates[1] + '&long=' + departure_coordinates[0]);
    var json = await response.body;

    console.log(json);



    const url = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];
    console.log(url);
    const response_travel = await fetch(url);
    var json2 = await JSON.parse(response_travel);
    console.log(json2);*/








    var caller = new XMLHttpRequest();
    var caller_position_station = new XMLHttpRequest();
    var caller_path_departure_station = new XMLHttpRequest();
    var caller_path_station_station = new XMLHttpRequest();
    var caller_path_sation_arrival = new XMLHttpRequest();
    var caller_path_full_walk = new XMLHttpRequest();

    caller.open('GET', url_departure, true);
    // The header set below limits the elements we are OK to retrieve from the server.
    caller.setRequestHeader ("Accept", "application/json");
    // onload shall contain the function that will be called when the call is finished.
    caller.onload=handlerDeparture;
    caller.send();


    //await new Promise(r => setTimeout(r, 2000));

    caller_position_station.open('GET', url_arrival, true);
    caller_position_station.setRequestHeader ("Accept", "application/json");
    // onload shall contain the function that will be called when the call is finished.
    caller_position_station.onload=handlerArrival;
    caller_position_station.send();



    await new Promise(r => setTimeout(r, 2200));



    const url_getPath_departure_station = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getWalkingPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+longitude_beginning_station+'&long2='+latitude_beginning_station;
    const url_getPath_station_station = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getCyclingPath?lat1='+longitude_beginning_station+'&long1='+latitude_beginning_station+'&lat2='+longitude_arrival_station+'&long2='+latitude_arrival_station;
    const url_getPath_station_arrival = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getWalkingPath?lat1='+longitude_arrival_station+'&long1='+latitude_arrival_station+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];
    const url_getPath_full_walk = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getWalkingPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];


    caller_path_departure_station.open('GET', url_getPath_departure_station, true);
    caller_path_departure_station.setRequestHeader ("Accept", "application/json");
    // onload shall contain the function that will be called when the call is finished.
    caller_path_departure_station.onload=finishHandler;
    caller_path_departure_station.send();

    await new Promise(r => setTimeout(r, 800));
    station_to_station_color_path = '#ec4545';



    caller_path_station_station.open('GET', url_getPath_station_station, true);
    caller_path_station_station.setRequestHeader ("Accept", "application/json");
    // onload shall contain the function that will be called when the call is finished.
    caller_path_station_station.onload=finishHandler;
    caller_path_station_station.send();

    await new Promise(r => setTimeout(r, 800));
    station_to_station_color_path = '#006dff';

    caller_path_sation_arrival.open('GET', url_getPath_station_arrival, true);
    caller_path_sation_arrival.setRequestHeader ("Accept", "application/json");
    // onload shall contain the function that will be called when the call is finished.
    caller_path_sation_arrival.onload=finishHandler;
    caller_path_sation_arrival.send();

    await new Promise(r => setTimeout(r, 800));

    caller_path_full_walk.open('GET', url_getPath_full_walk, true);
    caller_path_full_walk.setRequestHeader ("Accept", "application/json");
    // onload shall contain the function that will be called when the call is finished.
    caller_path_full_walk.onload=finishHandlerWalking;
    caller_path_full_walk.send();

    await new Promise(r => setTimeout(r, 900));

    //const url_getPath_station_station = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];
    //const url_getPath_station_arrival = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];




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
        console.log(total_duration + 'versus ' + walking_duration);
        if(walking_duration<total_duration){
            console.log('WALK');
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



    }


}







