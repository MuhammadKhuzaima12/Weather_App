//    API CONFIG
const API_KEY = "915c5646014abe2e9deba2e32250891c";

// Dom Elements
const loader = document.getElementById("loader");
const weatherCard = document.querySelector(".weather_card");
const cityTemp = document.querySelector(".city_temp");

// Show loader
function showLoader() {
  if (loader) loader.style.display = "flex";
}

// Hide loader
function hideLoader() {
  if (loader) loader.style.display = "none";
}

// Animate updates
function animateUpdate() {
  [weatherCard, cityTemp].forEach(el => {
    el.classList.add("animate-update");
    setTimeout(() => el.classList.remove("animate-update"), 500);
  });
}

//    API FETCH FUNCTION
async function fetch_api({ city = null, lat = null, lon = null } = {}) {
  let url = "";

  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  } else {
    return;
  }

  showLoader();

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      // SweetAlert error for city not found or other API errors
      Swal.fire({
        title: "Oops...",
        text: `${data.message}`,
        icon: "error"
      });

    // Clear search input
      document.getElementById("city_search_inp").value = "";
      hideLoader();
    return;
  }

    hideLoader();
    return data;
} catch (error) {
  // SweetAlert for network or unexpected errors
  Swal.fire({
    title: "Network Error",
    text: "Something went wrong while fetching weather data!",
    icon: "error"
  });

// Clear search input
    document.getElementById("city_search_inp").value = "";
    hideLoader();
  }
}

//    INIT WEATHER (SEARCH BUTTON)
async function initWeather() {
  const city = document.getElementById("city_search_inp").value.trim();

  if (!city) {
    Swal.fire({
      title: "Enter a city",
      text: "Please enter a city name to search.",
      icon: "warning"
    });
  return;
}

const data = await fetch_api({ city });
if (data) assign_values(data);
}


/*   LOAD WEATHER ON PAGE START
    (Geolocation + Default)*/
function loadWeatherOnStart() {
  showLoader();

  if (!navigator.geolocation) {
    loadDefaultWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      const data = await fetch_api({ lat, lon });
      if (data) assign_values(data);
    },
    () => {
      loadDefaultWeather();
    }
  );
}

async function loadDefaultWeather() {
  const data = await fetch_api({ city: "Karachi" });
  if (data) assign_values(data);
}

//    ASSIGN VALUES TO DOM
function assign_values(data) {

  // DOM Elements
  const elements = {
    loc: document.getElementById("loc"),
    day: document.getElementById("day"),
    date: document.getElementById("date"),
    temp: document.getElementById("temp"),
    tmin: document.getElementById("tmin_info"),
    tmax: document.getElementById("tmax_info"),
    icon: document.getElementById("icon"),
    icon_dsc: document.getElementById("icon_dsc"),
    humidity: document.getElementById("h_info"),
    wind: document.getElementById("w_info")
  };

  const {
    loc, day, date, temp: tempEl,
    tmin, tmax, icon, icon_dsc,
    humidity: h_info, wind: w_info
  } = elements;

  // Weather Data Destructuring
  let {
    name: city,
    main: {
      temp,
      temp_min,
      temp_max,
      humidity
    },
    wind: { speed },
    weather: [{ main: condition, description }]
  } = data;
  description = description.toUpperCase();

  // Assign Values
  loc.innerText = `${city}`;
  day.innerText = `${moment().format("dddd")},${moment().format("MMM Do YY")}`;

  tempEl.innerHTML = `${Math.round(temp)}°`;
  tmin.innerHTML = `${temp_min}°🌡️`;
  tmax.innerHTML = `${temp_max}°🌡️`;

  h_info.innerHTML = `${humidity}%💧`;
  w_info.innerHTML = `${(speed * 3.6).toFixed(1)} km/h💨`;

  icon_dsc.innerText = description;
  setIcon(condition, icon);
  setBackground(condition);

  if (el) {
    animateUpdate()  // Trigger animation on update
  }

  const search_inp = document.getElementById("city_search_inp");
  search_inp.value = ``;
}

//    WEATHER ICON HANDLER
{
  const weatherIcons = {
    Clear: "☀️",
    Clouds: "☁️",
    Drizzle: "🌦️",
    Rain: "🌧️",
    Thunderstorm: "⛈️",
    Snow: "❄️",

    Mist: "🌫️",
    Smoke: "🌫️",
    Haze: "🌫️",
    Fog: "🌫️",
    Dust: "🌪️",
    Sand: "🌪️",
    Ash: "🌋",
    Squall: "💨",
    Tornado: "🌪️"
  };

  function setIcon(condition, iconEl) {
    iconEl.innerText = weatherIcons[condition] || "🌤️";
  }
}

//    BACKGROUND HANDLER
{
  const weatherBackgrounds = {
    Clear: "url('./images/clear.webp')",
    Clouds: "url('./images/clouds.webp')",
    Drizzle: "url('./images/drizzle.webp')",
    Rain: "url('./images/rain.webp')",
    Thunderstorm: "url('./images/thunderstorm.webp')",
    Snow: "url('./images/snow.webp')",
    Mist: "url('./images/fog.webp')",
    Smoke: "url('./images/fog.webp')",
    Haze: "url('./images/fog.webp')",
    Fog: "url('./images/fog.webp')",
    Dust: "url('./images/dust.webp')",
    Sand: "url('./images/dust.webp')",
    Ash: "url('./images/ash.webp')",
    Squall: "url('./images/wind.webp')",
    Tornado: "url('./images/tornado.webp')"
  };

  const fog_color = "#2da8a8ff";
  const fog_color_wc = "#033131ff";

  const weatherColors = {
    Fog: fog_color,
    Mist: fog_color,
    Smoke: fog_color,

    Ash: fog_color,

    Thunderstorm: fog_color
  };


  function setBackground(condition) {
    // Body background image
    document.body.style.backgroundImage = weatherBackgrounds[condition] || "url('./images/fog.webp')";

    // Body text color
    document.body.style.color = weatherColors[condition] || "black";

    // Weather card text color
    const weatherCard = document.querySelector(".weather_card");
    if (weatherCard) {
      // Use fog_color_wc only for fog-like conditions
      if (weatherCard) {
        weatherCard.style.color =
          ["Fog", "Mist", "Smoke", "Ash", "Thunderstorm"].includes(condition)
            ? fog_color_wc
            : "black";
      }
    }
  }


}

//    PAGE LOAD EVENT
window.addEventListener("load", loadWeatherOnStart);
