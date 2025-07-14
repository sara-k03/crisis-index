// Initialize the Leaflet map inside the HTML element with id 'map'.
// Set the initial view to latitude 20, longitude 0, and zoom level 2 (world view).
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer as the base map tiles.
// Tiles are loaded from the OpenStreetMap tile server.
// Attribution is required to give credit to OpenStreetMap contributors.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

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

        layer.on('click', function () {
          loadCountryAnalysis(country);
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


function loadCountryAnalysis(countryName) {
  const panel = document.getElementById('info-panel');

  // Placeholder logic; replace with real data source in Phase 2
  const mockData = {
    "India": {
      conflicts: ["Manipur unrest", "Kashmir tensions"],
      riskIndex: 7.5,
      humanitarian: "High risk of displacement in NE regions"
    },
    "Sudan": {
      conflicts: ["Darfur conflict", "Khartoum struggle"],
      riskIndex: 9.1,
      humanitarian: "Widespread famine and conflict"
    }
  };

  const data = mockData[countryName];

  if (!data) {
    panel.innerHTML = `<h3>${countryName}</h3><p>No data available yet.</p>`;
    return;
  }

  panel.innerHTML = `
    <h3>${countryName}</h3>
    <p><strong>Conflicts:</strong> ${data.conflicts.join(", ")}</p>
    <p><strong>Risk Index:</strong> ${data.riskIndex}/10</p>
    <p><strong>Humanitarian Situation:</strong> ${data.humanitarian}</p>
  `;
}
