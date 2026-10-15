# Clima Claro

Clima Claro es una aplicación web pequeña para consultar las condiciones meteorológicas actuales y el pronóstico de los próximos siete días. El usuario escribe una ciudad, la aplicación localiza sus coordenadas y presenta temperatura, sensación térmica, humedad, viento, probabilidad de lluvia y estado general del cielo.

📄 **[Ver la bitácora de programación con IA](./bitacora-programacion-ia.pdf)**

## Tecnologías web utilizadas

- **HTML5:** estructura semántica, formulario de búsqueda, plantillas y atributos de accesibilidad.
- **CSS3:** diseño visual adaptable con Grid, Flexbox, propiedades personalizadas y media queries.
- **JavaScript (ES Modules):** lógica de la interfaz, validación y actualización dinámica del contenido.
- **Fetch API y servicios REST:** comunicación con las API de geocodificación y pronóstico de Open-Meteo.
- **Web Storage API (`localStorage`):** conservación de la preferencia de temperatura del usuario.
- **Node.js:** servidor HTTP local y ejecución de pruebas automatizadas.

Python no forma parte de la aplicación web: se usa únicamente como herramienta auxiliar para generar la bitácora en PDF.

## Funciones principales

- Búsqueda de ciudades en español.
- Condiciones meteorológicas actuales.
- Pronóstico de siete días.
- Cambio entre grados Celsius y Fahrenheit.
- Diseño adaptable para computadora y teléfono.
- Mensajes específicos para ciudad no encontrada, falta de conexión, tiempo de espera agotado, respuesta incompleta y límite de peticiones.
- Botón para reintentar una consulta fallida.

## API utilizada

La aplicación consume dos servicios gratuitos de [Open-Meteo](https://open-meteo.com/):

1. **Geocoding API:** convierte el nombre de una ciudad en coordenadas geográficas.
2. **Weather Forecast API:** devuelve las condiciones actuales y el pronóstico diario.

Open-Meteo no requiere una clave para este uso académico, por lo que el proyecto no contiene secretos ni credenciales.

## Cómo ejecutar el proyecto

### Requisitos

- Un navegador moderno.
- Node.js 18 o posterior, únicamente para ejecutar las pruebas o levantar el servidor sugerido.

### Opción 1: servidor con Node.js

```bash
npm start
```

Después abre la dirección que aparezca en la terminal, normalmente `http://localhost:3000`.

### Opción 2: servidor con Python

```bash
python -m http.server 8000 --directory dist
```

Después visita `http://localhost:8000`.

No se recomienda abrir `dist/index.html` directamente porque algunos navegadores restringen los módulos JavaScript cuando se usa el protocolo `file://`.

## Ejecutar las pruebas

```bash
npm test
```

Las pruebas comprueban las conversiones de temperatura, los códigos meteorológicos, el formato de ubicaciones, la validación de respuestas y los mensajes de error.

## Estructura

```text
dist/
  index.html           Interfaz y estructura accesible
  styles.css           Diseño adaptable
  app.js               Peticiones a la API y actualización de la interfaz
  weather-utils.js     Funciones de formato, validación y códigos del clima
test/
  weather-utils.test.js
bitacora-programacion-ia.pdf  Bitácora de programación con IA
```

## Seguridad y variables de entorno

Este proyecto no necesita claves de API. Aun así, `.gitignore` excluye archivos `.env` para evitar publicar credenciales si el proyecto se amplía en el futuro. Nunca deben escribirse claves privadas directamente en el código ni subirse al repositorio.

## Uso de herramientas de IA

### OpenAI Codex

Se utilizó OpenAI Codex para:

- Analizar los requisitos de la actividad.
- Proponer la estructura de la aplicación.
- Generar y revisar HTML, CSS y JavaScript.
- Integrar los servicios de Open-Meteo.
- Diseñar el manejo de errores.
- Crear pruebas automatizadas.
- Preparar la documentación y la bitácora.

### Herramientas auxiliares

- La documentación oficial de Open-Meteo se consultó para confirmar los parámetros de los endpoints.
- Git y GitHub se utilizan para conservar el historial del desarrollo y publicar el repositorio.
- Python y ReportLab se utilizan solamente para generar el documento PDF de la bitácora.

## Trabajo realizado sin ayuda de IA

El estudiante proporcionó la consigna, decidió encargarse personalmente de la demostración y será responsable de revisar el resultado, ejecutar la aplicación y explicar cualquier línea del código durante la entrega. El código de esta versión fue desarrollado con asistencia de Codex; no se presenta falsamente ninguna sección como escrita sin IA.

## Decisiones técnicas

- Se eligió JavaScript sin frameworks para que el proyecto sea fácil de estudiar y ejecutar.
- Las peticiones tienen un límite de espera de diez segundos.
- Las respuestas se validan antes de mostrarse.
- La preferencia Celsius/Fahrenheit se conserva en `localStorage`.
- El repositorio mantiene varios commits separados para reflejar la evolución del trabajo.

## Autor

**Angel Guadalupe Balam Moo**  
GitHub: [@abalam915-eng](https://github.com/abalam915-eng)

## Créditos

Datos meteorológicos proporcionados por [Open-Meteo](https://open-meteo.com/), bajo sus condiciones de uso para proyectos no comerciales.
