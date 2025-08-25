async function fetch_api() {
  console.clear();
  const loc = document.getElementById("loc");
  const day = document.getElementById("day");
  const date = document.getElementById("date");
  const temp = document.getElementById("temp");
  const icon = document.getElementById("icon");

    loc.innerHTML = ``;
    day.innerText = ``;
    date.innerText = ``;
    temp.innerHTML = ``;
    // icon.innerText = ``

  // let loc = navigator.geolocation.getCurrentPosition(
  //   (position) => {
  //     const lat = position.coords.latitude;
  //     const long = position.coords.longitude;
  //     loc = { lat, long };
  //     console.log(loc);
  //   },
  //   (error) => {
  //     console.error("Geolocation error:", error);
  //   }
  // );

  

  let city = document.getElementById("city_search_inp").value.trim();
  if (!city) {
    return;
  }
  let originalCity = city.toLowerCase(); // Store original input
  city = encodeURIComponent(originalCity); // Encode for URL
  console.log("Searched for:", originalCity);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&exclude=hourly,daily&appid=915c5646014abe2e9deba2e32250891c&units=metric`
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

    loc.innerHTML += `<i class="fa-solid fa-location-dot"></i>
    <b>${data.name},${data.sys.country}</b>`;
    day.innerText += `${moment().format("dddd")}`;
    date.innerText += `${moment().format("MMM Do YY")}`;
    temp.innerHTML += `${Math.round(data.main.temp)}&#176;C`;
    // icon.innerText += `${}`;

    console.log(data);
    console.log(data.name);
    console.log(data.sys.country);
    console.log(data.main.temp);
    console.log(data.main.feels_like);
    console.log(data.weather);
    console.log(data.weather[0].main);
    console.log(moment().format("MMM Do YY"));
    console.log(moment().format("dddd"));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


