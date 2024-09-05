const apiKey = 'daeb274c5152670a8ecfa46d94eadcd1'; // Sustituir con tu API Key

// Clima Actual
document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener el clima');
            return response.json();
        })
        .then(data => {
            const resultDiv = document.getElementById('result');
            const { main, weather, name } = data;
            const temperature = main.temp;
            const description = weather[0].description;
            const icon = weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            resultDiv.innerHTML = `
                <h2>Clima en ${name}:</h2>
                <p><img class="forecast-icon" src="${iconUrl}" alt="Icono del clima"> <strong>Temperatura:</strong> ${temperature}°C</p>
                <p><strong>Descripción:</strong> ${description}</p>
            `;
        })
        .catch(error => {
            document.getElementById('result').innerHTML = `
                <p class="error">Error: ${error.message}</p>
            `;
        });
});

// Pronóstico del Clima
document.getElementById('forecastForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('forecastCity').value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener el pronóstico');
            return response.json();
        })
        .then(data => {
            const forecastDiv = document.getElementById('forecastResult');
            forecastDiv.innerHTML = `<h2>Pronóstico del clima para ${data.city.name}:</h2>`;
            data.list.forEach(forecast => {
                const date = forecast.dt_txt;
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;
                const icon = forecast.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                forecastDiv.innerHTML += `
                    <div class="forecast-card">
                        <p><strong>${date.split(' ')[0]}</strong></p>
                        <img class="forecast-icon" src="${iconUrl}" alt="Icono del clima">
                        <p>${temp}°C</p>
                        <p>${description}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            document.getElementById('forecastResult').innerHTML = `
                <p class="error">Error: ${error.message}</p>
            `;
        });
});

// Historial Climático
document.getElementById('historyForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('historyCity').value;
    const date = new Date(document.getElementById('historyDate').value);
    const timestamp = Math.floor(date.getTime() / 1000);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener las coordenadas de la ciudad');
            return response.json();
        })
        .then(data => {
            const { coord } = data;
            const lat = coord.lat;
            const lon = coord.lon;

            const historyUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${apiKey}&units=metric`;

            return fetch(historyUrl);
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener los datos históricos');
            return response.json();
        })
        .then(data => {
            const historyDiv = document.getElementById('historyResult');
            const { current } = data;
            const temperature = current.temp;
            const description = current.weather[0].description;
            const icon = current.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            historyDiv.innerHTML = `
                <h2>Historial climático para ${city}:</h2>
                <p><img class="forecast-icon" src="${iconUrl}" alt="Icono del clima"> <strong>Temperatura:</strong> ${temperature}°C</p>
                <p><strong>Descripción:</strong> ${description}</p>
            `;
        })
        .catch(error => {
            document.getElementById('historyResult').innerHTML = `
                <p class="error">Error: ${error.message}</p>
            `;
        });
});
