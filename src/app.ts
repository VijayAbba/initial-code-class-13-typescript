import axios from "axios";

declare const L: any;
const ZOOM = 13;

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const map = L.map("map");

type NominatimGeocodingResponse = {
  features: {
    geometry: { coordinates: { lat: Number; lng: Number }[] };
    properties: { geocoding: { city: String; country: String; postcode: String } };
  }[];
  status: 200;
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to Google's API!

  axios
    .get<NominatimGeocodingResponse>(
      `https://nominatim.openstreetmap.org/?addressdetails=1&q=${encodeURI(
        enteredAddress
      )}&format=geocodejson&limit=1`
    )
    .then((response) => {
      console.log(response);
      console.log(response.data);
      console.log(response.data.features);
      if (!response.data.features.length) {
        throw new Error("Could not fetch location!");
      }

      const coordinates = [
        response.data.features[0].geometry.coordinates[1],
        response.data.features[0].geometry.coordinates[0],
      ];

      const location = {
        city: response.data.features[0].properties.geocoding.city,
        country: response.data.features[0].properties.geocoding.country,
        postcode: response.data.features[0].properties.geocoding.postcode,
      };

      map.setView(coordinates, ZOOM);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coordinates)
        .addTo(map)
        .bindPopup(`${location.city}<br>${location.country}<br>${location.postcode}`)
        .openPopup();
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
