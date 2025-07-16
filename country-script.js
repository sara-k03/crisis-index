// Extract the country name from the URL
const urlParams = new URLSearchParams(window.location.search);
const countryName = decodeURIComponent(urlParams.get('name'));

// Update the page title and header
document.title = `${countryName} Crisis Analysis`;
document.getElementById('country-name').textContent = countryName;

// Initialize a map (centered on the country later)
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch crisis data for the country
async function loadCountryData() {
  try {
    // Replace with real API calls (e.g., ACLED, GDACS)
    const response = await fetch(`country-data.json`);
    const data = await response.json();
    const countryData = data[countryName];

    if (!countryData) {
      document.getElementById('crisis-data').innerHTML = `<p>No data available for ${countryName}.</p>`;
      return;
    }

    // Update the UI
    document.getElementById('risk-index').textContent = countryData.riskIndex || 'N/A';
    document.getElementById('conflicts').textContent = countryData.conflicts?.join(', ') || 'None';
    document.getElementById('disasters').textContent = countryData.activeDisasters?.join(', ') || 'None';
    
    // Add sources as links
    const sourcesDiv = document.getElementById('sources');
    sourcesDiv.innerHTML = '<strong>Sources:</strong><br>' + 
      countryData.sources.map(src => `<a href="${src}" target="_blank">${src}</a>`).join('<br>');

    // TODO: Center the map on the country (requires GeoJSON coordinates)

  } catch (error) {
    console.error("Error loading data:", error);
    document.getElementById('crisis-data').innerHTML = `<p>Failed to load data for ${countryName}.</p>`;
  }
}

loadCountryData();