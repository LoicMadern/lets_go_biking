var latitude_beginning
var latitude_arrival
var longitude_beginning
var longitude_arrival

var current_layer
var map



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

    //console.log("coordonnées de l'adresse : " + adress + " : " + json.bbox[0] +"," + json.bbox[1]);
    var coordinates = [json.bbox[1] , json.bbox[0]];
    return coordinates;



}



async function markBeginning() {


    var latitude_beginning_station;
    var departureAdress = document.getElementById("debut").value;
    var arrivalAdress = document.getElementById("fin").value;
    var departure_coordinates = await findCoordinatesStreetMap(departureAdress);
    var arrival_coordinates = await findCoordinatesStreetMap(arrivalAdress);


    latitude_beginning = parseFloat(departure_coordinates[0]);
    longitude_beginning = parseFloat(departure_coordinates[1]);
    console.log(latitude_beginning + " " + longitude_beginning);



    //

    //const response = await fetch('http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getClosestStation?lat=' + departure_coordinates[1] + '&long=' + departure_coordinates[0]);
    //var json = await response.json();



    /*
    var longitude_beginning_station = await json["latitude"];
    latitude_beginning_station = json.latitude;

    console.log(longitude_beginning_station);
    console.log(latitude_beginning_station);*/


    latitude_arrival = parseFloat(arrival_coordinates[0]);
    longitude_arrival = parseFloat(arrival_coordinates[1]);

    const url = 'http://localhost:8736/Design_Time_Addresses/Proxy/ServiceHttp/getPath?lat1='+departure_coordinates[1]+'&long1='+departure_coordinates[0]+'&lat2='+arrival_coordinates[1]+'&long2='+arrival_coordinates[0];
    console.log(url);
    const response_travel = await fetch(url);
    var json2 = await response_travel;

    console.log(json2);













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

    if(layer != current_layer){

        map.removeLayer(current_layer);
        /*
        var center_latitude;
        var center_longitude;


        if (latitude_beginning=>longitude_beginning){
            center_latitude = Math.abs(latitude_beginning - latitude_arrival)/2+latitude_beginning;
        }else {
            center_latitude = Math.abs(latitude_beginning - latitude_arrival)/2+latitude_arrival;
        }

        if (longitude_beginning=>longitude_beginning){
            center_longitude = Math.abs(longitude_beginning - longitude_arrival)/2+longitude_beginning;
        }else {
            center_longitude = Math.abs(longitude_beginning - longitude_arrival) / 2 + longitude_arrival;
        }

        map.getView().setCenter(ol.proj.transform([center_latitude, center_longitude], 'EPSG:4326', 'EPSG:3857'));*/


        map.addLayer(layer);
        current_layer = layer;
    }


}





/*
var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([7.0985774, 43.6365619]))
            })
        ]
    })
});
map.addLayer(layer);


// Create an array containing the GPS positions you want to draw
var coords = [[7.0985774, 43.6365619], [7.1682519, 43.67163]];
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
        color: '#ffcc33',
        width: 10
    })
});

var source = new ol.source.Vector({
    features: [feature]
});

var vector = new ol.layer.Vector({
    source: source,
    style: [lineStyle]
});

map.addLayer(vector);
*/

