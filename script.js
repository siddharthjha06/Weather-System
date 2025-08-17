function fetchWeather() {
      const city = document.getElementById("cityInput").value;
      const url = `https://api.weatherapi.com/v1/current.json?key=70e342e9821d48f39de172815253105&q=${city}&aqi=yes`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const box = document.getElementById("weatherBox");
          if (data.location) {
            box.innerHTML = `
              <h2>${data.location.name}, ${data.location.country}</h2>
              <p><strong>${data.current.condition.text}</strong></p>
              <img src="${data.current.condition.icon}" alt="weather icon">
              <p>🌡️ Temp: ${data.current.temp_c} °C</p>
              <p>💧 Humidity: ${data.current.humidity}%</p>
              <p>🌬️ Wind: ${data.current.wind_kph} kph</p>
              <p>🌫️ Air Quality Index: ${data.current.air_quality.pm2_5.toFixed(2)}</p>
            `;
          } else {
            box.innerHTML = `<p>City not found!</p>`;
          }
        })
        .catch(() => {
          document.getElementById("weatherBox").innerHTML = `<p>Error fetching data</p>`;
        });
    }

    function makeRain() {
      for (let i = 0; i < 120; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        drop.style.left = Math.random() * window.innerWidth + 'px';
        drop.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(drop);
      }
    }

    makeRain();
// Disable right-click
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      alert("Right-click is disabled on this page!");
    });

    // Disable certain key combinations
    document.addEventListener("keydown", function (e) {
      // Block F12 (Inspect), Ctrl+Shift+I/J, Ctrl+U, Ctrl+C/X/V/S
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) || 
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) || 
        (e.ctrlKey && (e.key === "U" || e.key === "u")) || 
        (e.ctrlKey && (e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "X" || e.key === "x")) ||
        (e.ctrlKey && (e.key === "V" || e.key === "v")) ||
        (e.ctrlKey && (e.key === "S" || e.key === "s"))
      ) {
        e.preventDefault();
        alert("This action is disabled!");
      }
    });

