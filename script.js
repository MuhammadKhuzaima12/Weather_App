//    API CONFIG
const API_KEY = "915c5646014abe2e9deba2e32250891c";

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

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      console.error("API Error:", data.message);
      return;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

//    INIT WEATHER (SEARCH BUTTON)
async function initWeather() {
  const city = document.getElementById("city_search_inp").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const data = await fetch_api({ city });
  if (data) assign_values(data);
}

/*   LOAD WEATHER ON PAGE START
    (Geolocation + Default)*/
function loadWeatherOnStart() {
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
  const {
    name: city,
    sys: { country },
    main: {
      temp,
      temp_min,
      temp_max,
      humidity
    },
    wind: { speed },
    weather: [{ main: condition, description }]
  } = data;

  // Assign Values
  loc.innerText = `${city}, ${country}`;
  day.innerText = moment().format("dddd");
  date.innerText = moment().format("MMM Do YY");

  tempEl.innerHTML = `${Math.round(temp)}°`;
  tmin.innerHTML = `${Math.round(temp_min)}°`;
  tmax.innerHTML = `${Math.round(temp_max)}°`;

  h_info.innerHTML = `${humidity}%`;
  w_info.innerHTML = `${(speed * 3.6).toFixed(1)} km/h`;

  icon_dsc.innerText = description;
    setIcon(condition, icon);
    setBackground(condition);
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
        Clear: "url('images/clear.jpg')",
        Clouds: "url('images/clouds.jpg')",
        Drizzle: "url('images/drizzle.jpg')",
        Rain: "url('images/rain.jpg')",
        Thunderstorm: "url('images/thunderstorm.jpg')",
        Snow: "url('images/snow.jpg')",

        Dust: "url('images/dust.jpg')",
        Sand: "url('images/dust.jpg')",
        Ash: "url('images/ash.jpg')",
        Squall: "url('images/wind.jpg')",
        Tornado: "url('images/tornado.jpg')"
    };

    function setBackground(condition) {
        document.body.style.backgroundImage =
            weatherBackgrounds[condition] || "url('images/fog.jpg')";
    }
}

//    PAGE LOAD EVENT
window.addEventListener("load", loadWeatherOnStart);
