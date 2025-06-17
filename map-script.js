const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('resources/world-countries.json')
  .then(response => response.json())
  .then(geoData => {
    L.geoJSON(geoData, {
      onEachFeature: function (feature, layer) {
        const country = feature.properties.name;
        
        // Bind a tooltip with the country name, but don't open it immediately
        layer.bindTooltip(country, {sticky: true});
    
        // Optional: style on hover
        layer.on('mouseover', function () {
        this.setStyle({
            weight: 3,
            color: '#666',
            fillOpacity: 0.5
        });
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