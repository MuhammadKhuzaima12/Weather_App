const search_city = document.getElementById("search_city");
const weather_card = document.getElementById("weather_card");

async function fetch_api() {
  console.clear();
  const loc = document.getElementById("loc");
  const day = document.getElementById("day");
  const date = document.getElementById("date");
  const temp = document.getElementById("temp");
  const icon = document.getElementById("icon");
  const icon_dsc = document.getElementById("icon_dsc");
  const h_info = document.getElementById("h_info");
  const w_info = document.getElementById("w_info");

    loc.innerHTML = ``;
    day.innerText = ``;
    date.innerText = ``;
    temp.innerHTML = ``;
    icon.innerHTML = ``;
    icon_dsc.innerHTML = ``;
    h_info.innerHTML = ``;
    w_info.innerHTML = ``;

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

    search_city.style.display = "none";
    weather_card.style.display = "flex";
    const data_city = data.name;
    const data_country = data.sys.country;
    const data_temp = data.main.temp;
    const data_feels_like = data.main.feels_like;
    const data_humidity = data.main.humidity;
    const data_wind = data.wind.speed;
    const data_weather_cond = data.weather[0].main;
    const data_date = moment().format("MMM Do YY");
    const data_day = moment().format("dddd");

    // Check if the returned city name matches the input exactly (case-insensitive)
    const returnedCity = data_city.toLowerCase();
    if (returnedCity !== originalCity) {
      console.warn(
        `API returned data for "${returnedCity}" instead of "${originalCity}".`
      );
    }

    // icons src
    let src;
    if ((data_weather_cond).toLowerCase() == "clear") {
      src = `./assets/${data_weather_cond}.png`
    } else {
      src = `./assets/${data_weather_cond}.gif`
    }

    loc.innerHTML += `<i class="fa-solid fa-location-dot"></i>
    <b>${data_city},${data_country}</b>`;
    day.innerText += `${data_day}`;
    date.innerText += `${data_date}`;
    temp.innerHTML += `${Math.round(data_temp)}&#176;C`;
    icon.innerHTML += `<img src=${src} class="weather-icon weather-rainy" width="50px" height="50px"></img>`;
    icon_dsc.innerHTML += `${data_weather_cond}`;
    h_info.innerHTML += `<p><b>Humidity</b></p>
            <p>${data_humidity}%</p>`;
    w_info.innerHTML += `<p><b>Wind</b></p>
            <p>${data_wind}km/h</p>`;

    console.log(data);
    console.log(data.weather);
    console.log(data_weather_cond);
    console.log(data_city);
    console.log(data_country);
    console.log(data_temp);
    console.log(data_feels_like);
    console.log(data_weather_cond.toLowerCase());
    console.log(data_date);
    console.log(data_day);
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function on_change_loc() {
  weather_card.style.display = "none";
  search_city.style.display = "flex";
}

