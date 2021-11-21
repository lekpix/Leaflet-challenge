const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data){
    console.log(data);
    createFeatures(data.features);
});

//Fuction to assign color
  function chooseColor(depth) {
      console.log(depth);
    switch (true) {
    case depth > 90:
        return "#9900FF";   
    case depth > 70:
        return "#FF0033";
    case depth > 50:
        return "#FF6633";
    case depth > 30:
        return "#FF9933";
    case depth > 10:
            return "#FFFF33";
    case depth <=10:
        return "#99FF33";
    }
}
//Function to determine marker size
function markerSize(magnitude) {
    return (magnitude * 3);
  }

function createFeatures(earthquakeData) {  
    // Give each feature a popup that describes the place and time of the earthquake.
    //console.log(earthquakeData);
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Place:${feature.properties.place}</h3><hr><h4>Magnitude:${feature.properties.mag} Depth:${feature.geometry.coordinates[2]}</h4><hr><p>Time:${new Date(feature.properties.time)}</p>`);
    };
    
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, layer) {
            return L.circleMarker(layer);},
        style:function(feature){
            return {
                    opacity: 1,
                    fillOpacity: 1,
                    fillColor:chooseColor(feature.geometry.coordinates[2]),
                    color: "#000000",
                    radius: markerSize(feature.properties.mag)
                    };
        },
        onEachFeature: onEachFeature
    });
 
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }



  function createMap(earthquakes) {

    // Create the base layers.

    var myMap=L.map("map",{
        center:[37.09, -95.71],
        zoom:5,     
    });

   var street =
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    //Create base map objects
    var baseMaps={
        StreetLayer:street,
        "Topographic Map":topo
    };

    var overlayMaps={
        Earthquakes:earthquakes
    };
    
    L.control.layers(baseMaps,overlayMaps,{
        collapsed:false
    }).addTo(myMap);

    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        depthLevels = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3>Depth</h3>"

        for (var i = 0; i < depthLevels.length; i++) {
            div.innerHTML +='<i style="background: ' + chooseColor(depthLevels[i] +1) + '"></i> ' +
                 depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
}
