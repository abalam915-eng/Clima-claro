import {
  formatLocation,
  formatTemperature,
  friendlyError,
  getWeatherDescription,
  validateForecastPayload
} from "./weather-utils.js";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API = "https://api.open-meteo.com/v1/forecast";
const REQUEST_TIMEOUT_MS = 10_000;

class WeatherError extends Error {
  constructor(type, message) {
    super(message);
    this.name = "WeatherError";
    this.type = type;
  }
}

const elements = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#city-input"),
  status: document.querySelector("#status-panel"),
  statusMessage: document.querySelector("#status-message"),
  view: document.querySelector("#weather-view"),
  locationName: document.querySelector("#location-name"),
  locationDetail: document.querySelector("#location-detail"),
  localTimeLabel: document.querySelector("#local-time-label"),
  currentIcon: document.querySelector("#current-icon"),
  currentTemperature: document.querySelector("#current-temperature"),
  currentCondition: document.querySelector("#current-condition"),
  apparentTemperature: document.querySelector("#apparent-temperature"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#wind-speed"),
  updatedAt: document.querySelector("#updated-at"),
  forecastGrid: document.querySelector("#forecast-grid"),
  forecastTemplate: document.querySelector("#forecast-template"),
  unitToggle: document.querySelector("#unit-toggle"),
  retryButton: document.querySelector("#retry-button")
};

const state = {
  unit: localStorage.getItem("clima-claro-unit") === "f" ? "f" : "c",
  location: null,
  forecast: null,
  lastQuery: "Ciudad de México"
};

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });

    if (response.status === 429) {
      throw new WeatherError("rate-limit", "API rate limit reached");
    }
    if (!response.ok) {
      throw new WeatherError("service", `API responded with ${response.status}`);
    }

    const payload = await response.json();
    if (!payload || typeof payload !== "object") {
      throw new WeatherError("empty", "Empty API response");
    }
    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new WeatherError("timeout", "Request timed out");
    }
    if (error instanceof WeatherError) throw error;
    throw new WeatherError("connection", error.message);
  } finally {
    window.clearTimeout(timer);
  }
}

async function findLocation(city) {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "es",
    format: "json"
  });
  const payload = await fetchJson(`${GEOCODING_API}?${params}`);
  const location = payload.results?.[0];

  if (!location) {
    throw new WeatherError("empty", "No matching location");
  }
  return location;
}

async function getForecast(location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max"
    ].join(","),
    timezone: "auto",
    forecast_days: "7"
  });
  const payload = await fetchJson(`${FORECAST_API}?${params}`);

  if (!validateForecastPayload(payload)) {
    throw new WeatherError("empty", "Incomplete forecast response");
  }
  return payload;
}

function setStatus(message, { error = false, visible = true } = {}) {
  elements.statusMessage.textContent = message;
  elements.status.classList.toggle("error", error);
  elements.status.hidden = !visible;
  elements.retryButton.hidden = !error;
}

function formatDateParts(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat("es-MX", { weekday: "short" })
      .format(date)
      .replace(".", ""),
    date: new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" })
      .format(date)
      .replace(".", "")
  };
}

function renderUnitToggle() {
  elements.unitToggle.querySelectorAll("span").forEach((item) => {
    item.classList.toggle("active", item.dataset.unit === state.unit);
  });
}

function renderForecastCards() {
  const daily = state.forecast.daily;
  const fragment = document.createDocumentFragment();

  elements.forecastGrid.replaceChildren();
  daily.time.forEach((dateString, index) => {
    const node = elements.forecastTemplate.content.cloneNode(true);
    const date = formatDateParts(dateString);
    const weather = getWeatherDescription(daily.weather_code[index]);

    node.querySelector(".forecast-day").textContent = index === 0 ? "Hoy" : date.day;
    node.querySelector(".forecast-date").textContent = date.date;
    node.querySelector(".forecast-icon").textContent = weather.icon;
    node.querySelector(".forecast-condition").textContent = weather.label;
    node.querySelector(".temp-max").textContent = formatTemperature(
      daily.temperature_2m_max[index],
      state.unit
    );
    node.querySelector(".temp-min").textContent = formatTemperature(
      daily.temperature_2m_min[index],
      state.unit
    );
    const rain = daily.precipitation_probability_max[index];
    node.querySelector(".rain-chance").textContent = Number.isFinite(Number(rain))
      ? `Lluvia: ${Math.round(rain)}%`
      : "Lluvia: sin dato";
    fragment.append(node);
  });

  elements.forecastGrid.append(fragment);
}

function renderWeather() {
  const { current } = state.forecast;
  const weather = getWeatherDescription(current.weather_code);
  const updatedTime = current.time?.split("T")[1] ?? "--:--";

  elements.locationName.textContent = state.location.name;
  elements.locationDetail.textContent = formatLocation(state.location) || "Ubicacion seleccionada";
  elements.localTimeLabel.textContent = `Hora local · ${updatedTime}`;
  elements.currentIcon.textContent = weather.icon;
  elements.currentTemperature.textContent = formatTemperature(current.temperature_2m, state.unit);
  elements.currentCondition.textContent = weather.label;
  elements.apparentTemperature.textContent = formatTemperature(
    current.apparent_temperature,
    state.unit
  );
  elements.humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  elements.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  elements.updatedAt.textContent = `Actualizado a las ${updatedTime}`;

  renderUnitToggle();
  renderForecastCards();
  setStatus("", { visible: false });
  elements.view.hidden = false;
}

async function searchWeather(city) {
  const cleanCity = city.trim();
  if (cleanCity.length < 2) {
    setStatus("Escribe al menos dos caracteres para buscar una ciudad.", { error: true });
    elements.view.hidden = true;
    return;
  }

  elements.view.hidden = true;
  setStatus(`Buscando el clima de ${cleanCity}...`);
  state.lastQuery = cleanCity;
  elements.form.querySelector("button").disabled = true;

  try {
    const location = await findLocation(cleanCity);
    const forecast = await getForecast(location);
    state.location = location;
    state.forecast = forecast;
    renderWeather();
  } catch (error) {
    console.error("Weather request failed", error);
    setStatus(friendlyError(error), { error: true });
  } finally {
    elements.form.querySelector("button").disabled = false;
  }
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchWeather(elements.input.value);
});

elements.unitToggle.addEventListener("click", () => {
  state.unit = state.unit === "c" ? "f" : "c";
  localStorage.setItem("clima-claro-unit", state.unit);
  if (state.forecast) renderWeather();
});

elements.retryButton.addEventListener("click", () => {
  searchWeather(state.lastQuery);
});

window.addEventListener("offline", () => {
  setStatus("Parece que perdiste la conexión. Vuelve a intentarlo cuando estés en línea.", {
    error: true
  });
});

window.addEventListener("online", () => {
  if (elements.status.classList.contains("error")) {
    setStatus("La conexión volvió. Puedes reintentar la consulta.", { error: true });
  }
});

elements.input.value = "Ciudad de México";
searchWeather(elements.input.value);
