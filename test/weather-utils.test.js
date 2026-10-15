import test from "node:test";
import assert from "node:assert/strict";

import {
  celsiusToFahrenheit,
  formatLocation,
  formatTemperature,
  friendlyError,
  getWeatherDescription,
  validateForecastPayload
} from "../dist/weather-utils.js";

test("convierte grados Celsius a Fahrenheit", () => {
  assert.equal(celsiusToFahrenheit(0), 32);
  assert.equal(celsiusToFahrenheit(20), 68);
});

test("formatea temperaturas en ambas unidades", () => {
  assert.equal(formatTemperature(21.6, "c"), "22°");
  assert.equal(formatTemperature(20, "f"), "68°");
  assert.equal(formatTemperature(undefined), "--°");
});

test("describe codigos meteorologicos conocidos y desconocidos", () => {
  assert.equal(getWeatherDescription(0).label, "Cielo despejado");
  assert.equal(getWeatherDescription(95).icon, "⛈");
  assert.equal(getWeatherDescription(999).label, "Condición no disponible");
});

test("construye la descripcion de una ubicacion", () => {
  assert.equal(formatLocation({ admin1: "Yucatán", country: "México" }), "Yucatán, México");
  assert.equal(formatLocation({ country: "México" }), "México");
});

test("valida que la respuesta incluya datos actuales y diarios", () => {
  const validPayload = {
    current: { temperature_2m: 28 },
    daily: {
      time: ["2026-10-14"],
      weather_code: [1],
      temperature_2m_max: [30],
      temperature_2m_min: [21],
      precipitation_probability_max: [10]
    }
  };

  assert.equal(validateForecastPayload(validPayload), true);
  assert.equal(validateForecastPayload({ current: {}, daily: {} }), false);
  assert.equal(validateForecastPayload(null), false);
});

test("ofrece mensajes distintos para errores esperados", () => {
  assert.match(friendlyError({ type: "empty" }), /No encontramos/);
  assert.match(friendlyError({ type: "rate-limit" }), /límite/);
  assert.match(friendlyError({ type: "timeout" }), /tardó demasiado/);
  assert.match(friendlyError({ type: "connection" }), /conexión/);
});

