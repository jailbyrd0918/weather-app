import { useEffect, useState } from "react";

import "./CurrentWeather.css";

const CurrentWeather = ({ data }) => {
  const [ temp, setTemp ] = useState(0);
  const [ apparentTemp, setApparentTemp ] = useState(0);
  const [ humidity, setHumidity ] = useState(0);
  const [ windSpeed, setWindSpeed ] = useState(0);
  const [ windDirection, setWindDirection ] = useState("");
  const [ cloudCover, setCloudCover ] = useState(0);
  const [ pressure, setPressure ] = useState(0);
  const [ precipitation, setPrecipitation ] = useState(0);
  const [ isDay, setIsDay ] = useState(false);
  const [ iconImage, setIconImage ] = useState("");

  const degreesToCardinal = (degrees) => {
    const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  
    degrees = (degrees + 180) % 360;
    const index = Math.round(degrees / 45);
  
    return cardinalDirections[index];
  };

  useEffect(() => {
    const current = data.value;
      
    const weatherData = {
      temperature2m: current.variables(0).value(),
      relativeHumidity2m: current.variables(1).value(),
      apparentTemperature: current.variables(2).value(),
      isDay: current.variables(3).value(),
      precipitation: current.variables(4).value(),
      rain: current.variables(5).value(),
      showers: current.variables(6).value(),
      snowfall: current.variables(7).value(),
      weatherCode: current.variables(8).value(),
      cloudCover: current.variables(9).value(),
      pressureMsl: current.variables(10).value(),
      surfacePressure: current.variables(11).value(),
      windSpeed10m: current.variables(12).value(),
      windDirection10m: current.variables(13).value(),
      windGusts10m: current.variables(14).value(),
    };

    // save data
    {
      setTemp(Math.round(weatherData.temperature2m));
      setApparentTemp(Math.round(weatherData.apparentTemperature));
      setHumidity(Math.round(weatherData.relativeHumidity2m));
      setWindSpeed(Math.round(weatherData.windSpeed10m));
      setWindDirection(degreesToCardinal(weatherData.windDirection10m));
      setCloudCover(Math.round(weatherData.cloudCover));
      setPressure(Math.round(weatherData.pressureMsl));
      setPrecipitation(Math.round(weatherData.precipitation));
      setIsDay(weatherData.isDay);
    }

    // using WMO weather code to determine display icon
    {
      const wmoCode = weatherData.weatherCode;
      const isDay = weatherData.isDay;

      fetch("/assets/wmo.json")
      .then((response) => response.json())
      .then((data) => {
        const wmoData = data[`${wmoCode}`][`${isDay ? "day" : "night"}`];
        setIconImage(wmoData["image"]);
      });
    }
  }, [data]);

  return (
    <div className="current-container">
      <div className="left-container">
        <div className="details-container">
          <div className="details-item">
            <span className="details-label">Humidity</span>
            <span className="details-value">{humidity} %</span>
          </div>
          <div className="details-item left-border">
            <span className="details-label">Wind Speed</span>
            <span className="details-value">{windSpeed} km/h</span>
          </div>
          <div className="details-item left-border">
            <span className="details-label">Wind Direction</span>
            <span className="details-value">{windDirection}</span>
          </div>
          <div className="details-item top-border">
            <span className="details-label">Clouds</span>
            <span className="details-value">{cloudCover} %</span>
          </div>
          <div className="details-item top-border left-border">
            <span className="details-label">Pressure</span>
            <span className="details-value">{pressure} hPa</span>
          </div>
          <div className="details-item top-border left-border">
            <span className="details-label">Precipitation</span>
            <span className="details-value">{precipitation}mm</span>
          </div>
        </div>
      </div>
      
      <div className="right-container">
        <img src={iconImage} alt="sunny" className="current-icon" />

        <div className="current-temp-container">
          <span className="city-name">{data.city}</span>

          <div className="current-temp">
            <span className="current-temp-value">{temp}</span>
            <span className="current-temp-unit">°C</span>
          </div>

          <div className="apparent-temp-container">
            <span className="apparent-temp-label">FEELS LIKE</span>
            <span className="apparent-temp-value">{apparentTemp}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;