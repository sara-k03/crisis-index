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
          const country = feature.properties.name;
          // Open a new tab with country.html?name=[country]
          window.open(`country.html?name=${encodeURIComponent(country)}`, '_blank');
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


// function loadCountryAnalysis(countryName) {
//   console.log("Clicked country:", countryName);

//   const panel = document.getElementById('info-panel');

//   fetch('resources/country-data.json')
//     .then(response => response.json())
//     .then(data => {
//       const countryData = data[countryName];

//       if (!countryData) {
//         panel.innerHTML = `<h3>${countryName}</h3><p>No data available.</p>`;
//         return;
//       }

//       panel.innerHTML = `
//         <h3>${countryName}</h3>
//         <p><strong>Conflicts:</strong> ${countryData.conflicts.join(", ")}</p>
//         <p><strong>Risk Index:</strong> ${countryData.riskIndex}/10</p>
//         <p><strong>Humanitarian:</strong> ${countryData.humanitarian}</p>
//         <p><strong>Sources:</strong><br>${countryData.sources.map(link => `<a href="${link}" target="_blank">${link}</a>`).join("<br>")}</p>
//       `;
//     })
//     .catch(error => {
//       console.error("Error loading country data:", error);
//       panel.innerHTML = `<h3>${countryName}</h3><p>Error loading data.</p>`;
//     });
// }
