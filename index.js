const apiKey = 'YOUR_API_KEY'; 

document.getElementById('cityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherResponse.ok) {
        document.getElementById('temp').innerText = `${weatherData.main.temp} °C`;
        document.getElementById('low').innerText = `${weatherData.main.temp_min} °C`;
        document.getElementById('high').innerText = `${weatherData.main.temp_max} °C`;
        document.getElementById('humidity').innerText = `${weatherData.main.humidity} %`;
        document.getElementById('cloudCover').innerText = `${weatherData.clouds.all} %`;
        document.getElementById('sunrise').innerText = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
        document.getElementById('sunset').innerText = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
    } else {
        alert('Error fetching weather data: ' + weatherData.message);
    }

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (forecastResponse.ok) {
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = ''; 

        forecastData.list.forEach((entry) => {
            const forecastDiv = document.createElement('div');
            forecastDiv.innerText = `${entry.dt_txt}: ${entry.main.temp} °C, Humidity: ${entry.main.humidity}%`;
            forecastContainer.appendChild(forecastDiv);
        });

        const labels = forecastData.list.map(entry => entry.dt_txt);
        const temps = forecastData.list.map(entry => entry.main.temp);
        renderChart(labels, temps);
    } else {
        alert('Error fetching forecast data: ' + forecastData.message);
    }
});

function renderChart(labels, data) {
    const ctx = document.getElementById('WeatherChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date & Time'
                    }
                }
            }
        }
    });
}
