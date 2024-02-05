import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

import { SearchBar, CurrentWeather, HourlyForecast, DailyForecast } from "./components";
import { INITIAL_CITY_NAME, INITIAL_LATITUDE, INITIAL_LONGITUDE, WEATHER_API_URL } from "./constants";
import "./App.css";

const App = () => {
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [hourlyForecastData, setHourlyForecastData] = useState(null);
  const [dailyForecastData, setDailyForecastData] = useState(null);

  useEffect(() => {
    const lat = INITIAL_LATITUDE;
    const lon = INITIAL_LONGITUDE;
    const city = INITIAL_CITY_NAME;
    
    const currentWeatherParams = {
      "latitude": lat,
      "longitude": lon,
      "current": [
        "temperature_2m", 
        "relative_humidity_2m", 
        "apparent_temperature", 
        "is_day", 
        "precipitation", 
        "rain", 
        "showers", 
        "snowfall", 
        "weather_code", 
        "cloud_cover", 
        "pressure_msl", 
        "surface_pressure", 
        "wind_speed_10m", 
        "wind_direction_10m", 
        "wind_gusts_10m"
      ],
      "hourly": [
        "temperature_2m", 
        "relative_humidity_2m", 
        "precipitation_probability", 
        "rain", 
        "showers", 
        "snowfall", 
        "weather_code", 
        "pressure_msl",
        "cloud_cover", 
        "visibility", 
        "wind_speed_10m", 
        "wind_direction_10m", 
        "wind_gusts_10m"
      ],
      "daily": [
        "weather_code", 
        "temperature_2m_max", 
        "temperature_2m_min", 
        "daylight_duration", 
        "sunshine_duration", 
        "precipitation_sum", 
        "rain_sum", 
        "showers_sum", 
        "snowfall_sum", 
        "wind_speed_10m_max", 
        "wind_gusts_10m_max", 
        "wind_direction_10m_dominant"
      ]
    };
    
    const loadInit = async () => {
      const promises = await fetchWeatherApi(WEATHER_API_URL, currentWeatherParams);
      const responses = await Promise.all(promises);

      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      
      
      /* -------------------- current weather -------------------- */
      
      const current = response.current();

      setCurrentWeatherData({ 
        city: city, 
        value: current, 
      });


      /* -------------------- hourly forecast -------------------- */
      
      const hourly = response.hourly();
      setHourlyForecastData({
        utcOffset: utcOffsetSeconds,
        timezone: timezone,
        timezoneAbbr: timezoneAbbreviation,
        value: hourly 
      });
      

      /* -------------------- daily forecast -------------------- */
      
      const daily = response.daily();
      setDailyForecastData({
        utcOffset: utcOffsetSeconds,
        timezone: timezone,
        timezoneAbbr: timezoneAbbreviation,
        value: daily
      });
    }

    loadInit();

  }, [])

  const handleSearchChange = async (data) => {
    const lat = data.value.latitude;
    const lon = data.value.longtitude;
    const city = data.value.cityName;
    
    const currentWeatherParams = {
      "latitude": lat,
      "longitude": lon,
      "current": [
        "temperature_2m", 
        "relative_humidity_2m", 
        "apparent_temperature", 
        "is_day", 
        "precipitation", 
        "rain", 
        "showers", 
        "snowfall", 
        "weather_code", 
        "cloud_cover", 
        "pressure_msl", 
        "surface_pressure", 
        "wind_speed_10m", 
        "wind_direction_10m", 
        "wind_gusts_10m"
      ],
      "hourly": [
        "temperature_2m", 
        "relative_humidity_2m", 
        "precipitation_probability", 
        "rain", 
        "showers", 
        "snowfall", 
        "weather_code", 
        "pressure_msl",
        "cloud_cover", 
        "visibility", 
        "wind_speed_10m", 
        "wind_direction_10m", 
        "wind_gusts_10m"
      ],
      "daily": [
        "weather_code", 
        "temperature_2m_max", 
        "temperature_2m_min", 
        "daylight_duration", 
        "sunshine_duration", 
        "precipitation_sum", 
        "rain_sum", 
        "showers_sum", 
        "snowfall_sum", 
        "wind_speed_10m_max", 
        "wind_gusts_10m_max", 
        "wind_direction_10m_dominant"
      ]
    };
    
    const fetch = await fetchWeatherApi(WEATHER_API_URL, currentWeatherParams);
    const response = fetch[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    
    
    /* -------------------- current weather -------------------- */
    
    const current = response.current();

    setCurrentWeatherData({ 
      city: city, 
      value: current, 
    });


    /* -------------------- hourly forecast -------------------- */
    
    const hourly = response.hourly();
    setHourlyForecastData({
      utcOffset: utcOffsetSeconds,
      timezone: timezone,
      timezoneAbbr: timezoneAbbreviation,
      value: hourly 
    });
    

    /* -------------------- daily forecast -------------------- */
    
    const daily = response.daily();
    setDailyForecastData({
      utcOffset: utcOffsetSeconds,
      timezone: timezone,
      timezoneAbbr: timezoneAbbreviation,
      value: daily
    });

  }

  return (
    <div className="container">
      {/* location search bar */}
      <SearchBar onSearchChange={handleSearchChange} />

      {/* information about current temperature */}
      { currentWeatherData && <CurrentWeather data={currentWeatherData} /> }

      {/* hourly weather forecast for next 24-hour  */}
      { hourlyForecastData && <HourlyForecast data={hourlyForecastData} /> }

      {/* daily weather forecast for next 10-day */}
      { dailyForecastData && <DailyForecast data={dailyForecastData} /> }
    </div>
  );
}

export default App;