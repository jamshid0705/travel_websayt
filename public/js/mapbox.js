// import 'mapbox-gl/dist/mapbox-gl.css';
// const mapboxgl=require('mapbox-gl')

const locations=JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations)

mapboxgl.accessToken = 'pk.eyJ1IjoiamFtc2hpZGtoYXRhbW92IiwiYSI6ImNsand0dWRyYzA0Z2EzcGxjeWRsN3RlOTcifQ.wZPNpmIaQoC0hZbd0n6BKQ';
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [12.550343, 55.665957],
  zoom: 8
});
