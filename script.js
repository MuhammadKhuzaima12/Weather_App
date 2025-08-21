
async function fetch_api() {
  console.clear;
  let loc = navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      loc = { lat, long };
      console.log(loc);
    },
    (error) => {
      console.error("Geolocation error:", error);
    }
  );

  let city = document.getElementById("city_search_inp").value.trim();
  if (!city) {
    return;
  }
  let originalCity = city.toLowerCase(); // Store original input
  city = encodeURIComponent(originalCity); // Encode for URL
  console.log("Searched for:", originalCity);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=915c5646014abe2e9deba2e32250891c&units=metric`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      console.error("API Error:", data.message);
      return;
    }

    // Check if the returned city name matches the input exactly (case-insensitive)
    const returnedCity = data.name.toLowerCase();
    if (returnedCity !== originalCity) {
      console.warn(
        `API returned data for "${returnedCity}" instead of "${originalCity}".`
      );
    }

    console.log(data);
    console.log(data.main);
    console.log(data.main.temp);
    console.log(data.main.feels_like);
    console.log(data.weather);
    console.log(data.weather[0].main);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
