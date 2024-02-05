import { useEffect, useState } from "react";

import "./HourlyForecast.css";

const HourlyForecast = ({ data }) => {
  const [ icons, setIcons ] = useState([]);
  const [ weatherData, setWeatherData ] = useState(null);
  const [ times, setTimes ] = useState([]);
  const [ temps, setTemps ] = useState([]);
  const [ humidities, setHumidities ] = useState([]);
  const [ clouds, setClouds ] = useState([]);
  const [ precipitations, setPrecipitations ] = useState([]);
  const [ windSpeeds, setWindSpeeds ] = useState([]);
  const [ windDirections, setWindDirections ] = useState([]);
  const [ pressures, setPressures ] = useState([]);
  const [ visibilities, setVisibilities ] = useState([]);

  const hourNum = 24;

  const range = (start, stop, step) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const degreesToCardinal = (degrees) => {
    const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  
    degrees = (degrees + 180) % 360;
    const index = Math.round(degrees / 45);
  
    return cardinalDirections[index];
  };

  useEffect(() => {
    const hourly = data.value;
    const utcOffset = data.utcOffset;

    const hourlyData = {
      time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffset) * 1000)
      ),
      temperature2m: hourly.variables(0).valuesArray(),
      relativeHumidity2m: hourly.variables(1).valuesArray(),
      precipitationProbability: hourly.variables(2).valuesArray(),
      rain: hourly.variables(3).valuesArray(),
      showers: hourly.variables(4).valuesArray(),
      snowfall: hourly.variables(5).valuesArray(),
      weatherCode: hourly.variables(6).valuesArray(),
      pressureMsl: hourly.variables(7).valuesArray(),
      cloudCover: hourly.variables(8).valuesArray(),
      visibility: hourly.variables(9).valuesArray(),
      windSpeed10m: hourly.variables(10).valuesArray(),
      windDirection10m: hourly.variables(11).valuesArray(),
      windGusts10m: hourly.variables(12).valuesArray(),
    };

    const loadIcons = async () => {
      const promises = [];

      for (let i = 0; i < hourNum; i++) {
        const response = fetch("/assets/wmo.json").then((response) => response.json());
        promises.push(response);
      }

      const responses = await Promise.all(promises);

      const loadIcons = responses.map((data, i) => {
        const wmoCode = hourlyData.weatherCode[i];
        const wmoData = data[`${wmoCode}`]["day"];
        return wmoData["image"];
      });

      setIcons(loadIcons);
    };

    loadIcons();
    setWeatherData(hourlyData);
    
    setTemps(Array.from(hourlyData.temperature2m).splice(0, hourNum));
    setHumidities(Array.from(hourlyData.relativeHumidity2m).splice(0, hourNum));
    setClouds(Array.from(hourlyData.cloudCover).splice(0, hourNum));
    setPrecipitations(Array.from(hourlyData.precipitationProbability).splice(0, hourNum));
    setWindSpeeds(Array.from(hourlyData.windSpeed10m).splice(0, hourNum));
    setWindDirections(Array.from(hourlyData.windDirection10m).splice(0, hourNum));
    setPressures(Array.from(hourlyData.pressureMsl).splice(0, hourNum));
    setVisibilities(Array.from(hourlyData.visibility).splice(0, hourNum));

    const translateTimes = () => {
      const arr = Array.from(hourlyData.time).splice(0, hourNum);

      const translatedTimes = arr.map((timeString) => {
        const date = new Date(timeString);
        const formattedTime = date.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: false });
        return formattedTime;
      });

      setTimes(translatedTimes);
    }

    translateTimes();

  }, [data]);

  return (
    <div>
      <h1>Hourly Forecast</h1>
      <div className="list-container">
        {
          weatherData && temps.map((temp, index) => (
            <div key={`hourly-container-${index}`}>
              <button key={`hourly-button-${index}`} className="list-item">
                <span className="list-item-time">{times[index]}</span>
                <img src={`${icons[index]}`} alt="weather-icon" className="list-item-icon" />  
                <span className="list-item-time">{Math.round(temp) }°C</span>
                <ul className="list-item-details">
                  <li className="list-item-details-item">
                    <span className="list-item-details-label">Humidity</span>
                    <span className="list-item-details-value">{humidities[index]}%</span>
                  </li>
                  <li className="list-item-details-item">
                    <span className="list-item-details-label">Cloud</span>
                    <span className="list-item-details-value">{clouds[index]}%</span>
                  </li>
                  <li className="list-item-details-item">
                    <span className="list-item-details-label">Precipitation Prob.</span>
                    <span className="list-item-details-value">{precipitations[index]}%</span>
                  </li>
                  <li className="list-item-details-item">
                    <span className="list-item-details-label">Wind</span>
                    <span className="list-item-details-value">
                      {Math.round(windSpeeds[index])} km/h ({degreesToCardinal(windDirections[index])})</span>
                  </li>
                  <li className="list-item-details-item">
                    <span className="list-item-details-label">Pressure</span>
                    <span className="list-item-details-value">{Math.round(pressures[index])} hPa</span>
                  </li>
                  <li className="list-item-details-item">
                    <span className="list-item-details-label">Visibility</span>
                    <span className="list-item-details-value">{visibilities[index]} m</span>
                  </li>
                </ul>  
              </button>
            </div>
          )) 
        }
      </div>
    </div>
  );
}

export default HourlyForecast;