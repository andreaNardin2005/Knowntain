// Inizializza la mappa
var map = L.map('map').setView([46.06669241963698, 11.124612328470988], 11);

// Base layer
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Controllo dei layer
var overlayMaps = {};

// funzione per aggiungere layer al filtro
function addLayerFilter(name) {
  let filterContainer = document.querySelector("#filter-container");
  var filterCheckbox = document.querySelector("#filter-checkbox").content.cloneNode(true);

  var input = filterCheckbox.querySelector("input");
  var lable = filterCheckbox.querySelector("label");

  input.id = name;
  input.value = name;

  lable.setAttribute("for", name);
  lable.textContent = name;

  filterContainer.appendChild(filterCheckbox);

  addFilterEvents(input);
}

// aggiungo la logica al bottone per il filtro
function addFilterEvents(sel){
  sel.addEventListener("click", () => {
    if (sel.checked) {
      let name = sel.value;
      map.addLayer(overlayMaps[name]);
    } else {
      let name = sel.value;
      map.removeLayer(overlayMaps[name]);
    }
  })
}

// funzione per aggiungere layer alla mappa
function addGeoJSONLayer(name, url, options = {}) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const layer = L.geoJSON(data, {
        style: feature => ({
          color: options.color || "lightblue",
          fillColor: options.fillColor || "lightblue",
          fillOpacity: options.fillOpacity ?? 0.4,
          weight: options.weight || 2
        }),

        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name){
            const center = layer.getBounds().getCenter();

            console.log("centro: " + center + "   " + feature.properties.name); 
            L.marker(center, {
              icon: L.divIcon({
                className: "feature-inner-text",
                html: feature.properties.name
              })
            }).addTo(map);
          }
        }
      });

      // Aggiunge al controllo layer
      overlayMaps[name] = layer;
      addLayerFilter(name);
    })
    .catch(err => console.error("Errore nel caricamento di", name, err));
}

// aggiungo i layer alla mappa e al filtro
addGeoJSONLayer("Popolazione orso", "geo/orso.geojson", { fillColor: "lightblue" });
addGeoJSONLayer("Pinete", "geo/pinete.geojson", { color: "green", fillColor: "lightgreen" });

// Posizione dell'utente
document.addEventListener("DOMContentLoaded", () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    const latitude = crd.latitude;
    const longitude = crd.longitude;

    L.marker([latitude, longitude]).addTo(map);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
});