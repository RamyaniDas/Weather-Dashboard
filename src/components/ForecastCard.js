import React from 'react';
import './ForecastCard.css';

const ForecastCard = ({ forecastData, unit }) => {
  if (!forecastData || !forecastData.list) {
    return null; // or return a loading/error message
  }

  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  // Pick one forecast per day (every 8 items = 24 hours)
  const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 4);

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
        {dailyForecast.map((day, idx) => {
          const date = new Date(day.dt_txt);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div className="forecast-card" key={idx}>
              <p className="day">{dayName}</p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt="icon"
              />
              <p className="temp">{Math.round(day.main.temp)}{unitSymbol}</p>
              <p className="desc">{day.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
