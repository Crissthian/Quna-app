mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: coordinates,
  zoom: 12,
});

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>Quna Listing</h3>
        <small>📍 ${listingDataforMap.location}, ${listingDataforMap.country}</small>
        <p>This place is available for booking. Click to know more!</p>
      `)
  )
  .addTo(map);
