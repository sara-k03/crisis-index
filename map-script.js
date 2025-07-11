// Initialize the Leaflet map inside the HTML element with id 'map'.
// Set the initial view to latitude 20, longitude 0, and zoom level 2 (world view).
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer as the base map tiles.
// Tiles are loaded from the OpenStreetMap tile server.
// Attribution is required to give credit to OpenStreetMap contributors.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

// First fetch the risk data
fetch('resources/country-risk-data.json')
  .then(response => response.json())
  .then(riskData => {
    
    // Then fetch the geoJSON
    fetch('resources/world-countries.json')
      .then(response => response.json())
      .then(geoData => {
        
        // Pass both datasets to this function
        L.geoJSON(geoData, {
          onEachFeature: function (feature, layer) {
            const country = feature.properties.name;

            // Pull risk data for this country
            const risk = riskData[country] || {
              armed_conflict_risk: "Data not available",
              economic_instability_risk: "Data not available",
              environmental_disaster_risk: "Data not available"
            };

            // Create popup content with the risks
            const popupContent = `
              <strong>${country}</strong><br>
              Armed Conflict Risk: ${risk.armed_conflict_risk}<br>
              Economic Instability Risk: ${risk.economic_instability_risk}<br>
              Environmental Disaster Risk: ${risk.environmental_disaster_risk}
            `;

            layer.bindTooltip(country, { sticky: true });

            // Highlight on mouseover
            layer.on('mouseover', function () {
              this.setStyle({ weight: 3, color: '#666', fillOpacity: 0.5 });
              this.openTooltip();
            });

            // Reset on mouseout
            layer.on('mouseout', function () {
              this.setStyle({ weight: 1, color: '#444', fillOpacity: 0.2 });
              this.closeTooltip();
            });

            // Show the risk data on click
            layer.on('click', function () {
              layer.bindPopup(popupContent).openPopup();
            });

            // Initial style
            layer.setStyle({ color: '#444', weight: 1, fillOpacity: 0.2 });
          }
        }).addTo(map);
      });
  });
