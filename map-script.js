// Initialize the Leaflet map inside the HTML element with id 'map'.
const map = L.map('map', {
  worldCopyJump: false,      // Prevents jumping when crossing the date line
  maxBoundsViscosity: 1.0,   // Prevents dragging outside bounds
  maxBounds: [               // Prevents map from panning beyond world extent
    [-90, -180],
    [90, 180]
  ]
}).setView([20, 0], 2);

// Add OpenStreetMap tile layer as the base map tiles.
// Tiles are loaded from the OpenStreetMap tile server.
// Attribution is required to give credit to OpenStreetMap contributors.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  minZoom: 2,
  maxZoom: 18
}).addTo(map);

// Fetch the GeoJSON file containing country polygons.
// Fetch returns a "Promise" which represents the future result of an asynchronous operation 
fetch('resources/world-countries.json')
  .then(response => response.json()) // Parse the response as JSON
  .then(geoData => { // .then denotes a task to be performed after an asynchronous operation
    // Add the GeoJSON data to the map
    L.geoJSON(geoData, {
      // For each country polygon feature, define custom behavior and styling
      onEachFeature: function (feature, layer) {
        // Get the country's name from GeoJSON properties
        const country = feature.properties.name;
        
        // Bind a tooltip to the country polygon showing the country name.
        // 'sticky: true' means the tooltip follows the mouse cursor.
        layer.bindTooltip(country, {sticky: true});
    
        // When the user moves the mouse over the country polygon...
        layer.on('mouseover', function () {
          // Change the polygon style to highlight it
          this.setStyle({
            weight: 3, // border
            color: '#666', // color
            fillOpacity: 0.5 // more opaque fill
          });
          // Open tool tup
          this.openTooltip();
        });

        layer.on('mouseout', function () {
          this.setStyle({
            weight: 1,
            color: '#444',
            fillOpacity: 0.2
          });
          this.closeTooltip();
        });

        // Initial style
        layer.setStyle({
          color: '#444',
          weight: 1,
          fillOpacity: 0.2
        });
      }
    }).addTo(map);
  });