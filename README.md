# Crisis Index

## Overview
The goal of this project is to develop a machine learning model that analyses every country in terms of how at-risk they are in the following categories:

- Armed Conflicts (civil wars, interstate wars, etc.)
- Economic Instability (inflation, unemployment, etc.)
- Environmental Disasters (floods, droughts, earthquakes, wildfires, etc.)

Link: https://sara-k03.github.io/crisis-index/map.html

## Current Functionality
Created a map where if you hover over the country, the name displays

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
