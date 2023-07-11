// import 'mapbox-gl/dist/mapbox-gl.css';
// const mapboxgl=require('mapbox-gl')

const locations=JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations)

mapboxgl.accessToken='pk.eyJ1IjoiamFtc2hpZGtoYXRhbW92IiwiYSI6ImNsanh0M3R2NTE0YnQzaW4xeWJvaXJhbnMifQ.NsCbNGAzU5G6OZJHvpKqaQ'
const map =new mapboxgl.Map({
  container:'map',
  style:'mapbox://styles/mapbox/streets-v12'
})
