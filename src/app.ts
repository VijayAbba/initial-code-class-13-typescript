import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

type ResponseType = {
  lat: string;
  lon: string;
}[];

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to Google's API!

  axios
    .get<ResponseType>(
      `https://nominatim.openstreetmap.org/search?q=${encodeURI(enteredAddress)}&format=json`
    )
    .then((response) => {
      console.log(response);
      if (response.status !== 200) {
        throw new Error("Could not fetch location!");
      }

      const coordinates = { lat: response.data[0].lat, lon: response.data[0].lon };
      console.log(coordinates);
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
