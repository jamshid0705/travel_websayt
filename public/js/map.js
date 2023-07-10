const locations=JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations)

mapboxgl.accessToken=
'pk.eyJ1IjoiamFtc2hpZGtoYXRhbW92IiwiYSI6ImNsand5MWlvajAwbXAzbnJ4eGV1aHdkcDQifQ.NPgc_MDbkCB_xn2KD2XCJQ'
var map =new mapboxgl.Map({
  container:'map',
  style:'mapbox://styles/mapbox/streets-v11'
})