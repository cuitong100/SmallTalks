import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall?lat=49&lon=-123&exclude=hourly,daily,minutely&appid=b7b7192edc6a683e80999f0f40d5ec66');
        // const response = {
        //     data: {"lat":49,"lon":-123,"timezone":"America/Los_Angeles","timezone_offset":-25200,"current":{"dt":1682189739,"sunrise":1682168839,"sunset":1682219601,"temp":284.08,"feels_like":282.98,"pressure":1023,"humidity":67,"dew_point":278.2,"uvi":1.21,"clouds":100,"visibility":10000,"wind_speed":0.51,"wind_deg":130,"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"rain":{"1h":1.1}}}
        // };
        setWeatherData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getWeatherData();
  }, []);

  return (
    <div className="weather-card">
      {weatherData ? (
        <>
            <div>
                <img
                    src={`http://openweathermap.org/img/w/${weatherData.current.weather[0].icon}.png`}
                    alt={weatherData.current.weather[0].description}
                />
            </div>
            <div className="weather-line">
                <h2>{weatherData.current.weather[0].main}</h2>
                <p>{Math.round(weatherData.current.temp - 273.15)}&deg;C</p>
                <p>{weatherData.current.weather[0].description}</p>
            </div>
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherCard;
