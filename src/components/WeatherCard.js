import React from 'react';

const WeatherCard = ({ data, unit }) => {
  const { name, main, weather, wind, sys } = data;

  const unitTemp = unit === 'metric' ? '°C' : '°F';
  const unitSpeed = unit === 'metric' ? 'm/s' : 'mph';

  const toDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="weather-card">
      <h2>
        {name}, {sys?.country}
      </h2>

      <div className="weather-main">
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt="weather icon"
        />
        <div>
          <p className="main-weather">{weather[0].main}</p>
          <p className="description">{weather[0].description}</p>
        </div>
      </div>

      <div className="details">
        <p>🌡 Temperature: {main.temp} {unitTemp}</p>
        <p>🤒 Feels like: {main.feels_like} {unitTemp}</p>
        <p>💧 Humidity: {main.humidity}%</p>
        <p>📈 Pressure: {main.pressure} hPa</p>
        <p>🌬 Wind: {wind.speed} {unitSpeed} {wind.deg != null ? `(${toDirection(wind.deg)})` : ''}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
