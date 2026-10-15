export const WEATHER_CODES = {
  0: { label: "Cielo despejado", icon: "☀" },
  1: { label: "Mayormente despejado", icon: "🌤" },
  2: { label: "Parcialmente nublado", icon: "⛅" },
  3: { label: "Nublado", icon: "☁" },
  45: { label: "Niebla", icon: "🌫" },
  48: { label: "Niebla con escarcha", icon: "🌫" },
  51: { label: "Llovizna ligera", icon: "🌦" },
  53: { label: "Llovizna moderada", icon: "🌦" },
  55: { label: "Llovizna intensa", icon: "🌧" },
  56: { label: "Llovizna helada", icon: "🌧" },
  57: { label: "Llovizna helada intensa", icon: "🌧" },
  61: { label: "Lluvia ligera", icon: "🌦" },
  63: { label: "Lluvia moderada", icon: "🌧" },
  65: { label: "Lluvia intensa", icon: "🌧" },
  66: { label: "Lluvia helada", icon: "🌧" },
  67: { label: "Lluvia helada intensa", icon: "🌧" },
  71: { label: "Nevada ligera", icon: "🌨" },
  73: { label: "Nevada moderada", icon: "🌨" },
  75: { label: "Nevada intensa", icon: "❄" },
  77: { label: "Granulos de nieve", icon: "❄" },
  80: { label: "Chubascos ligeros", icon: "🌦" },
  81: { label: "Chubascos moderados", icon: "🌧" },
  82: { label: "Chubascos fuertes", icon: "⛈" },
  85: { label: "Chubascos de nieve", icon: "🌨" },
  86: { label: "Chubascos fuertes de nieve", icon: "🌨" },
  95: { label: "Tormenta eléctrica", icon: "⛈" },
  96: { label: "Tormenta con granizo", icon: "⛈" },
  99: { label: "Tormenta fuerte con granizo", icon: "⛈" }
};

export function getWeatherDescription(code) {
  return WEATHER_CODES[Number(code)] ?? { label: "Condición no disponible", icon: "◌" };
}

export function celsiusToFahrenheit(value) {
  return (Number(value) * 9) / 5 + 32;
}

export function formatTemperature(value, unit = "c") {
  if (!Number.isFinite(Number(value))) return "--°";
  const converted = unit === "f" ? celsiusToFahrenheit(value) : Number(value);
  return `${Math.round(converted)}°`;
}

export function formatLocation(location) {
  return [location.admin1, location.country].filter(Boolean).join(", ");
}

export function validateForecastPayload(payload) {
  const current = payload?.current;
  const daily = payload?.daily;
  const dailyKeys = [
    "time",
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max"
  ];

  return Boolean(
    current &&
      Number.isFinite(Number(current.temperature_2m)) &&
      daily &&
      dailyKeys.every((key) => Array.isArray(daily[key]) && daily[key].length > 0)
  );
}

export function friendlyError(error) {
  const type = error?.type;

  if (type === "empty") {
    return "No encontramos resultados. Revisa el nombre de la ciudad e intenta de nuevo.";
  }
  if (type === "rate-limit") {
    return "Se alcanzó temporalmente el límite de consultas. Espera un momento e intenta de nuevo.";
  }
  if (type === "timeout") {
    return "La consulta tardó demasiado. Revisa tu conexión e intenta nuevamente.";
  }
  if (type === "connection" || error instanceof TypeError) {
    return "No pudimos conectarnos al servicio del clima. Verifica tu conexión a internet.";
  }
  return "Ocurrió un problema al consultar el clima. Intenta nuevamente en unos minutos.";
}

