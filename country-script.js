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

// Function to fetch a random country image from Wikimedia Commons
async function fetchCountryImage(country) {
  try {
    // First search for images related to the country
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(country)}&srnamespace=6&srlimit=50&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    // Extract image titles from search results
    const imageTitles = searchData.query.search.map(item => item.title.replace('File:', ''));
    if (imageTitles.length === 0) return null;
    
    // Select a random image from the results
    const randomImageTitle = imageTitles[Math.floor(Math.random() * imageTitles.length)];
    
    // Get the image URL
    const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(randomImageTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.json();
    
    const pages = imageData.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].imageinfo[0].url;
  } catch (error) {
    console.error("Error fetching country image:", error);
    return null;
  }
}

// Fetch crisis data for the country
async function loadCountryData() {
  try {
    // First load the country image
    const imageUrl = await fetchCountryImage(countryName);
    if (imageUrl) {
      document.getElementById('country-image').src = imageUrl;
    } else {
      // Fallback to a generic image if no specific one found
      document.getElementById('country-image').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/World_flag_2004.png/640px-World_flag_2004.png';
    }

    // Then load the crisis data
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

  } catch (error) {
    console.error("Error loading data:", error);
    document.getElementById('crisis-data').innerHTML = `<p>Failed to load data for ${countryName}.</p>`;
  }
}

loadCountryData();