// Overview
// Below is a very common format for Leaflet
//
// I like to define all the functions at the top of my scripts because I can view what the functions does before
// reading the code.  When putting a function at the top of the page, you may need to be careful about the order
// of the functions.  Most of the time you can have functions anywhere - at the bottom, top or in the middle of
// the code.  One exception is if a user defined function is also used inside a user defined function then the function
// loading might be affected.  

// Javascipt Order Article:  https://www.jsdiaries.com/does-javascript-function-order-matter/



// Store our API endpoint inside queryUrl

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr>Magnitude: " + feature.properties.mag);
  }




 // Define streetmap and darkmap layers
 var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });
// if more than one layer to L is listed the one that shows up 
// is the one defined last above myMap declaration

// Add streetmap tile to map; if only one tile defined then this is a good way of doing this.
// If only one tile layer then the following will be used "L.control.layers(null, overlayMaps, " later in the code
streetmap.addTo(myMap);
// if multiple tiles are being used then the above code is not needed.  The multiple tiles will be added
// when "L.control.layers(baseMaps, overlayMaps, " 


// create layer; will attach data later on
var earthquakes = new L.LayerGroup();
// Alternate method below and same as above
// var earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
// All layers are added through these lines of code
// if only one tile layer is being used then the basemaps tile group can be 
// replaced with null.  This will prevent a tile button from showing in the
// upper right corner of the screen
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);



function getColor(d) {
  return d > 90 ? '#b10026' :
         d > 70  ? '#fd8d3c' :
         d > 50  ? '#fee391' :
         d > 30  ? '#a1d99b' :
         d > 10   ? '#41ab5d' :
                    '#005a32';
}





// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl  = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL


d3.json(queryUrl).then(function(data) {

  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  geojsonLayer = L.geoJSON(data, {
    style: function(feature) {
      return {
        fillColor: getColor(feature.geometry.coordinates[2]),
        weight: 2,
        opacity: 1,
        color: 'grey',
        fillOpacity: 0.7
      };
    },
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: feature.properties.mag * 5, 
        fillOpacity: 0.85
      });
  },
    onEachFeature: popUpMsg,
    
  }).addTo(earthquakes);

  // Here are some additional examples:  https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/ 

  // earthquakes.addTo(myMap);
  earthquakes.addTo(myMap);
});

// Another good example is Day 3 Citibike; above is a more linear version of the code that does not include all the functions.
// Just like onEachFeature, there are other options that can be included, see the documentation
// https://leafletjs.com/reference-1.7.1.html#geojson-option 
// https://leafletjs.com/examples/geojson/

// Here is a common structure

// Step 1: Define Tile Layers
// Step 2.  Define Basemaps
// Step 3:  Define Leaflet map with default layers included 
// Step 4:  If there is only one tile then Add one tile with Addto(map); in L.control use null as first parameter
// Step 5:  Create a layer for each dataset that can be used as an overlay in the controls
// Step 5.  Add Overlays
// Step 6.  Add controls to L; Use null for first term if only one tile (see Step4 and this example)
//Step 7.  Load GeoJson via d3.json so that the file is loaded
	// Step 8.  Add data to map via geojson
	// Step 8a.  May include these options.. see https://leafletjs.com/reference-1.7.1.html#geojson-option
  //    pointToLayer - change from default marker - see pointToLayer example here https://leafletjs.com/examples/geojson/ especially geojsonMarkerOptions definition; this variable could also be set to the style:; look up examples via google
  //    style  - example of use in Day 2 Activity 1; but styles the marker/feature; look up examples in conjunction with pointToLayer
  //    onEachFeature - many examples mostly of popups; action that occurs when marker is clicked on the map
  //    filter - not used in activites or in the homework
// Step 8b.  addTo(layer***)     Note:  not map; choose a layer group
// Step 9.  Add layergroup to map with addTo(map)

// Pulling info from Day 3 Activity 1 Advanced

// Step 10.  Create legend
// Step 11.  Use onAdd to include legend + DomUtil.create
// Step 12.  Add legend to map with .addTo(map)

// IF there are more data to be added and it is unrelated to first data set then steps 7-9 can be mimicked.
// Always check the data to see what type of json data it is.  L.geoJson() will map whatever geometries found in a
// json or geojson file.  If it is a geometry.type of polygon then it will be an enclosed shape; if it is a Linestring then it will be multiple lines connected, etc

