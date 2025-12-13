import React, { useState, useEffect } from 'react';
import { FaThermometerHalf, FaTint, FaCloud, FaWind, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const UserdashboardContent = () => {
  const [weather, setWeather] = useState({ temp: 0, humidity: 0, condition: 'Loading...', windSpeed: 0 });
  const [city, setCity] = useState('Colombo');

  useEffect(() => {
    const fetchWeather = async () => {
      const API_KEY = '619d0cca4c074daf9e4121535252603'; // Replace with your WeatherAPI key
      const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;

      try {
        const response = await axios.get(url);
        const data = response.data;
        setWeather({
          temp: Math.round(data.current.temp_c),
          humidity: data.current.humidity,
          condition: data.current.condition.text,
          windSpeed: Math.round(data.current.wind_kph),
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  const weatherCards = [
    { icon: FaThermometerHalf, value: `${weather.temp}°C`, label: 'Temperature', color: 'text-red-500' },
    { icon: FaTint, value: `${weather.humidity}%`, label: 'Humidity', color: 'text-blue-500' },
    { icon: FaCloud, value: weather.condition, label: 'Weather', color: 'text-gray-500' },
    { icon: FaWind, value: `${weather.windSpeed} km/h`, label: 'Wind Speed', color: 'text-green-500' },
    { icon: FaMapMarkerAlt, value: city, label: 'Location', color: 'text-yellow-500' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {weatherCards.map((card, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg transform transition-all duration-300 hover:scale-105" style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}}>
              <card.icon className={`${card.color} text-3xl`} />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800 mb-1">{card.value}</div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserdashboardContent;