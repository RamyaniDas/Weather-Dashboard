import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard'; // You'll create this
import SearchHistory from './components/SearchHistory'; // Optional component

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [theme, setTheme] = useState('default');
  const [searchHistory, setSearchHistory] = useState([]);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  // --- Get Weather by City ---
  const getWeather = async (cityName) => {
    if (!cityName?.trim()) return;

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`
      );

      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setError('');
      setCity('');

      updateTheme(weatherRes.data.weather[0].main);
      updateSearchHistory(cityName);
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast(null);
      setError('City not found. Try again!');
    }
  };

  // --- Handle Geolocation ---
  const getGeolocationWeather = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
        );

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
        );

        setWeather(res.data);
        setForecast(forecastRes.data);
        setError('');
        updateTheme(res.data.weather[0].main);
        updateSearchHistory(res.data.name);
      } catch (err) {
        console.error(err);
        setError('Could not get location weather.');
      }
    });
  };

  // --- Theme logic based on weather type ---
  const updateTheme = (weatherType) => {
    const condition = weatherType.toLowerCase();
    if (condition.includes('rain')) setTheme('rain');
    else if (condition.includes('cloud')) setTheme('cloud');
    else if (condition.includes('clear')) setTheme('clear');
    else if (condition.includes('snow')) setTheme('snow');
    else setTheme('default');
  };

  // --- Search history management ---
  const updateSearchHistory = (cityName) => {
    setSearchHistory((prev) => {
      const updated = [cityName, ...prev.filter((c) => c !== cityName)];
      return updated.slice(0, 5);
    });
  };

  // --- Toggle Units ---
  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') getWeather(city);
  };

  return (
    <div className={`app theme-${theme}`}>
      <h1>🌦 Weather Dashboard</h1>

      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => getWeather(city)}>Search</button>
          <button onClick={getGeolocationWeather}>📍 Use My Location</button>
        </div>

        <div className="unit-toggle">
          <button onClick={toggleUnit}>
            Toggle Units: {unit === 'metric' ? '°C' : '°F'}
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <>
          <WeatherCard data={weather} unit={unit} />
          {forecast && <ForecastCard forecastData={forecast} unit={unit} />}
        </>
      )}

      {searchHistory.length > 0 && (
        <SearchHistory
          history={searchHistory}
          onSelect={getWeather}
        />
      )}
    </div>
  );
}

export default App;
