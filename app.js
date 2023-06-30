const apiKey = "";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

async function getWeatherByLocation(city) {
  try {
    const resp = await fetch(url(city), {
      origin: "cros"
    });

    if (resp.ok) {
      const respData = await resp.json();
      addWeatherToPage(respData);
    } else if (resp.status === 404) {
      throw new Error("City not found.");
    } else {
      throw new Error("Failed to fetch weather data.");
    }
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  // Display the error message to the user
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error");
  errorDiv.textContent = error.message;

  // Remove any existing weather data
  main.innerHTML = "";
  main.appendChild(errorDiv);
}

function addWeatherToPage(data) {
  const temp = Ktoc(data.main.temp);

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
    <h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
      ${temp}°C
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
    </h2>
    <small>${data.weather[0].main}</small>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
    <p>Visibility: ${data.visibility} meters</p>
    <p>Description: ${data.weather[0].description}</p>`;

  // Set background image based on weather
  const body = document.querySelector("body");
  const weatherCondition = data.weather[0].main.toLowerCase();
  const isNight = isNightTime();

  if (weatherCondition.includes("rain")) {
    body.style.backgroundImage = `url("rainy.jpg")`;
  } else if (weatherCondition.includes("cloud") && !isNight) {
    body.style.backgroundImage = `url("cloudy.jpg")`;
  } else if (isNight) {
    body.style.backgroundImage = `url("night.jpg")`;
  } else if (weatherCondition.includes("clear") && isNight) {
    body.style.backgroundImage = `url("clear.jpg")`;
  } else {
    body.style.backgroundImage = `url("default.jpg")`;
  }

  // Cleanup
  main.innerHTML = "";
  main.appendChild(weather);
}

function isNightTime() {
  const currentHour = new Date().getHours();
  return currentHour < 6 || currentHour > 18;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = search.value;

  if (city) {
    try {
      await getWeatherByLocation(city);
    } catch (error) {
      handleError(error);
    }
  } else {
    handleError(new Error("Please enter a valid city."));
  }
});

function Ktoc(K) {
  return Math.floor(K - 273.15);
}
