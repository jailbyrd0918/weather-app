import { useEffect, useState } from "react";

import "./DailyForecast.css";

const DailyForecast = ({ data }) => {
  const [ icons, setIcons ] = useState([]);
  const [ weatherData, setWeatherData ] = useState(null);
  const [ times, setTimes ] = useState([]);
  const [ maxTemps, setMaxTemps ] = useState([]);
  const [ minTemps, setMinTemps ] = useState([]);
  const [ sunshineDurations, setSunshineDurations ] = useState([]);
  const [ daylightDurations, setDaylightDurations ] = useState([]);
  const [ precipitationSums, setPrecipitationSums ] = useState([]);
  const [ maxWindSpeeds, setMaxWindSpeeds ] = useState([]);
  const [ domWindDirections, setDomWindDirections ] = useState([]);
  const [ rainSums, setRainSums ] = useState([]);

  const dayNum = 7;

  const range = (start, stop, step) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const degreesToCardinal = (degrees) => {
    const cardinalDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  
    degrees = (degrees + 180) % 360;
    const index = Math.round(degrees / 45);
  
    return cardinalDirections[index];
  };

  useEffect(() => {
    const daily = data.value;

    const utcOffset = data.utcOffset;

    const dailyData = {
      time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffset) * 1000)
      ),
      weatherCode: daily.variables(0).valuesArray(),
      temperature2mMax: daily.variables(1).valuesArray(),
      temperature2mMin: daily.variables(2).valuesArray(),
      daylightDuration: daily.variables(3).valuesArray(),
      sunshineDuration: daily.variables(4).valuesArray(),
      precipitationSum: daily.variables(5).valuesArray(),
      rainSum: daily.variables(6).valuesArray(),
      showersSum: daily.variables(7).valuesArray(),
      snowfallSum: daily.variables(8).valuesArray(),
      windSpeed10mMax: daily.variables(9).valuesArray(),
      windGusts10mMax: daily.variables(10).valuesArray(),
      windDirection10mDominant: daily.variables(11).valuesArray()
    };

    console.log(dailyData);

    const loadIcons = async () => {
      const promises = [];

      for (let i = 0; i < dayNum; i++) {
        const response = fetch("/assets/wmo.json").then((response) => response.json());
        promises.push(response);
      }

      const responses = await Promise.all(promises);

      const loadIcons = responses.map((data, i) => {
        const wmoCode = dailyData.weatherCode[i];
        const wmoData = data[`${wmoCode}`]["day"];
        return wmoData["image"];
      });

      setIcons(loadIcons);
    };

    loadIcons();
    setWeatherData(dailyData);
    
    setMaxTemps(Array.from(dailyData.temperature2mMax));
    setMinTemps(Array.from(dailyData.temperature2mMin));
    setSunshineDurations(Array.from(dailyData.sunshineDuration));
    setDaylightDurations(Array.from(dailyData.daylightDuration));
    setPrecipitationSums(Array.from(dailyData.precipitationSum));
    setMaxWindSpeeds(Array.from(dailyData.windSpeed10mMax));
    setDomWindDirections(Array.from(dailyData.windDirection10mDominant));
    setRainSums(Array.from(dailyData.rainSum));

    const translateTimes = () => {
      const arr = Array.from(dailyData.time);
    
      const translatedTimes = arr.map((timeString) => {
        const date = new Date(timeString);
        const formattedTime = date.toLocaleDateString([], { weekday: "short", month: "short", day: "2-digit" });
        return formattedTime;
      });
    
      setTimes(translatedTimes);
    }

    translateTimes();

  }, [data]);

  return (
    <div>
      <h1>Daily Forecast</h1>
      <div className="daily-list-container">
        {
          weatherData && maxTemps.map((maxTemp, index) => (
            <div key={`daily-container-${index}`}>
              <button key={`daily-button-${index}`} className="daily-list-item">
                <img src={`${icons[index]}`} alt="weather-icon" className="list-item-icon" />  
                <div className="daily-list-values">
                  <span className="daily-list-item-time">{times[index]}</span>
                  <span className="list-item-low">L: {Math.round(minTemps[index]) }°C</span>
                  <span className="list-item-high">H: {Math.round(maxTemp) }°C</span>
                </div>
                <ul className="daily-list-item-details">
                  <li className="daily-list-item-details-item">
                    <span className="daily-list-item-details-label">Sunshine Duration</span>
                    <span className="daily-list-item-details-value">{Math.round(sunshineDurations[index] / 3600)} hour(s)</span>
                  </li>
                  <li className="daily-list-item-details-item">
                    <span className="daily-list-item-details-label">Daylight Duration</span>
                    <span className="daily-list-item-details-value">{Math.round(daylightDurations[index] / 3600)} hour(s)</span>
                  </li>
                  <li className="daily-list-item-details-item">
                    <span className="daily-list-item-details-label">Precipitation Sum</span>
                    <span className="daily-list-item-details-value">{Math.round(precipitationSums[index])}mm</span>
                  </li>
                  <li className="daily-list-item-details-item">
                    <span className="daily-list-item-details-label">Wind Sum</span>
                    <span className="daily-list-item-details-value">{Math.round(maxWindSpeeds[index])} km/h ({degreesToCardinal(domWindDirections[index])})</span>
                  </li>
                  <li className="daily-list-item-details-item">
                    <span className="daily-list-item-details-label">Rain Sum</span>
                    <span className="daily-list-item-details-value">{Math.round(rainSums[index])}mm</span>
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

export default DailyForecast;