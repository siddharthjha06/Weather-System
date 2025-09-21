const apiKey = "70e342e9821d48f39de172815253105"; // Replace with your WeatherAPI key
let currentUnit = "C";
let map;
let marker;
let lastData = null;

// Fetch weather
async function getWeather() {
  const location = document.getElementById("locationInput").value.trim();
  if (!location) {
    alert("Please enter a location");
    return;
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=7&aqi=yes`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      alert("Error: " + data.error.message);
      return;
    }

    lastData = data; // store for tab switching

    // Update left panel
    document.getElementById("currentCity").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("temperature").innerText =
      currentUnit === "C" ? data.current.temp_c + "°C" : data.current.temp_f + "°F";
    document.getElementById("condition").innerText = data.current.condition.text;
    document.getElementById("feelsLike").innerText =
      "Feels like: " + (currentUnit === "C" ? data.current.feelslike_c + "°C" : data.current.feelslike_f + "°F");
    document.getElementById("humidity").innerText = "Humidity: " + data.current.humidity + "%";
    document.getElementById("wind").innerText = "Wind: " + data.current.wind_kph + " km/h";
    document.getElementById("pressure").innerText = "Pressure: " + data.current.pressure_mb + " mb";
    document.getElementById("visibility").innerText = "Visibility: " + data.current.vis_km + " km";
    document.getElementById("airQuality").innerText = "PM2.5: " + data.current.air_quality.pm2_5.toFixed(1);
    document.getElementById("time").innerText = "Local Time: " + data.location.localtime;

    // Update map
    initMap(data.location.lat, data.location.lon, data.location.name);

    // Default tab
    showMap();
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch weather data.");
  }
}

// Map
function initMap(lat, lon, city) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map).bindPopup(`<b>${city}</b>`).openPopup();
  } else {
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]).setPopupContent(`<b>${city}</b>`).openPopup();
  }
}

// Units
function changeUnit() {
  currentUnit = document.getElementById("unitSelect").value;
  if (lastData) getWeather(); // refresh
}

// Tabs
function resetTabs() {
  document.querySelectorAll(".bottom-tabs button").forEach(btn => btn.classList.remove("active"));
  document.getElementById("map").classList.add("hidden");
  document.getElementById("forecast").classList.add("hidden");
  document.getElementById("airQualityPanel").classList.add("hidden");
}

function showMap() {
  resetTabs();
  document.querySelector(".bottom-tabs button:nth-child(5)").classList.add("active");
  document.getElementById("panelTitle").innerText = "Map";
  document.getElementById("map").classList.remove("hidden");
  if (map) map.invalidateSize();
}

function showToday() {
  if (!lastData) return;
  resetTabs();
  document.querySelector(".bottom-tabs button:nth-child(1)").classList.add("active");
  document.getElementById("panelTitle").innerText = "Today's Weather";
  const today = lastData.forecast.forecastday[0];
  document.getElementById("forecast").innerHTML = `
    <p><b>Max:</b> ${today.day.maxtemp_c}°C / ${today.day.maxtemp_f}°F</p>
    <p><b>Min:</b> ${today.day.mintemp_c}°C / ${today.day.mintemp_f}°F</p>
    <p><b>Condition:</b> ${today.day.condition.text}</p>
  `;
  document.getElementById("forecast").classList.remove("hidden");
}

function showTomorrow() {
  if (!lastData) return;
  resetTabs();
  document.querySelector(".bottom-tabs button:nth-child(2)").classList.add("active");
  document.getElementById("panelTitle").innerText = "Tomorrow's Weather";
  const tomorrow = lastData.forecast.forecastday[1];
  document.getElementById("forecast").innerHTML = `
    <p><b>Max:</b> ${tomorrow.day.maxtemp_c}°C / ${tomorrow.day.maxtemp_f}°F</p>
    <p><b>Min:</b> ${tomorrow.day.mintemp_c}°C / ${tomorrow.day.mintemp_f}°F</p>
    <p><b>Condition:</b> ${tomorrow.day.condition.text}</p>
  `;
  document.getElementById("forecast").classList.remove("hidden");
}

function showWeek() {
  if (!lastData) return;
  resetTabs();
  document.querySelector(".bottom-tabs button:nth-child(3)").classList.add("active");
  document.getElementById("panelTitle").innerText = "7-Day Forecast";
  let html = "<ul>";
  lastData.forecast.forecastday.forEach(day => {
    html += `<li>${day.date}: ${day.day.condition.text}, ${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</li>`;
  });
  html += "</ul>";
  document.getElementById("forecast").innerHTML = html;
  document.getElementById("forecast").classList.remove("hidden");
}

function showAirQuality() {
  if (!lastData) return;
  resetTabs();
  document.querySelector(".bottom-tabs button:nth-child(4)").classList.add("active");
  document.getElementById("panelTitle").innerText = "Air Quality";
  const aq = lastData.current.air_quality;
  document.getElementById("airQualityPanel").innerHTML = `
    <p><b>PM2.5:</b> ${aq.pm2_5.toFixed(1)}</p>
    <p><b>PM10:</b> ${aq.pm10.toFixed(1)}</p>
    <p><b>O3:</b> ${aq.o3.toFixed(1)}</p>
    <p><b>NO2:</b> ${aq.no2.toFixed(1)}</p>
    <p><b>SO2:</b> ${aq.so2.toFixed(1)}</p>
    <p><b>CO:</b> ${aq.co.toFixed(1)}</p>
  `;
  document.getElementById("airQualityPanel").classList.remove("hidden");
}

  // Disable right click
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      alert("Right-click is disabled!");
    });

    // Disable inspect-related keys
    document.addEventListener("keydown", function (e) {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
        e.preventDefault();
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "U") {
        e.preventDefault();
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === "S") {
        e.preventDefault();
      }
    });
