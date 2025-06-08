function fetchWeather() {
      const city = document.getElementById("cityInput").value;
      const url = `http://api.weatherapi.com/v1/current.json?key=5253105&q=${city}&aqi=yes`;

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
