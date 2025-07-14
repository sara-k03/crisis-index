# Crisis Index

## Overview
The goal of this project is to eventually implement an interactive map-based platform that aggregates live conflict, disaster, economic, and news data to generate dynamic crisis profiles for every country. 

Clicking on a country should open a detailed dashboard with:
- Real-time alerts (armed conflicts, natural disasters)
- Risk scoring (ML-powered severity predictions)
- Historical trends (economic collapse patterns)
- Sentiment analysis (news/media tone classification)

Link: https://sara-k03.github.io/crisis-index/map.html

## Current Functionality
Created a map where if you hover over the country, the name displays. If you click on the country, an empty
dashboard opens for that country. 

## Resources 
### Leaflet 
Leaflet is an open-source JavaScript library for interactive maps. Leaflet 1.9.4 is being used for this project. 
Link: https://leafletjs.com/index.html 

### OpenStreetMap Tile Server 
Tiles are used to represent smaller portions of maps. Only necessary tiles are loaded, making map interactions more interactive
and smooth. The OpenStreetMap (OSM) tile server can only be used to for personal or small-scale projects.  

### GeoJSON File: world-countries.json
This contains data respresenting the boundaries/shapes of countries. 
Download Link: https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/world-countries.json 
