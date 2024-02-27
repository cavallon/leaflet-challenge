// Store our API endpoint as a query URL
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Fetch the earthquake data
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});
function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Lat, Lng, Depth: ${feature.geometry.coordinates}</h3><hr><p>Location: ${feature.properties.place}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Date & Time: ${new Date(feature.properties.time)}</p>`);
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.sqrt(feature.properties.mag) * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });
  // Call the createMap function, passing in the earthquakes layer.
  createMap(earthquakes);
}
// ... (previous code remains unchanged)

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    // Add legend
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = ["Green", "Light Green", "Yellow", "Light Orange", "Orange", "Red"];
    
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                (depths[i] === -10 ? '&lt; ' : '') + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
  
    legend.addTo(myMap);
  }
  
  // ... (rest of the code remains unchanged)
  
// Function to determine the color based on depth
function getColor(depth) {
  if (depth >= -10 && depth <= 10) return '#56BF0B';
  else if(depth >= 10 && depth <= 30) return '#DDF033';
  else if(depth >= 30 && depth <= 50) return '#FBC744';
  else if(depth >= 50 && depth <= 70) return '#FBB544';
  else if(depth >= 70 && depth <= 90) return '#FB8244';
  else if(depth > 90) return '#FB4744';
  else return "black";
}



// legend.addTo(myMap);
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (myMap) {

//     var div = L.DomUtil.create('div', 'info legend')
        

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < feature.length; i++) {
//         div.innerHTML += '<i style="background:' + getColor(feature[i].geometry.coordinates[2])+'></i><span>Water</span><br>';
//     }

//     return div;
// };

// legend.addTo(myMap);