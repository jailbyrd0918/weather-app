import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

import { GEO_API_URL } from "../../constants";
import "./SearchBar.css";

const SearchBar = ({ onSearchChange }) => {
  const [retrievedData, setRetrievedData] = useState(null);

  const handleChange = (data) => {
    setRetrievedData(data);
    onSearchChange(data);
  }

  const loadSuggestions = (input) => {
    if (input.length === 0) {
      return { options: [] } 
    }
    else {
      return fetch(
        `${GEO_API_URL}?name=${input}&language=en&format=json`
      )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.results.map((city) => {
            const cityName = city.name;
            const cityLabel = `${cityName}, ${city.admin1}, ${city.country}`;
            const cityLatitude = city.latitude;
            const cityLongitude = city.longitude;

            return {
              label: cityLabel,
              value: {
                cityName: cityName,
                latitude: cityLatitude,
                longtitude: cityLongitude,
              },
            }
          })
        }
      })
      .catch((error) => console.error(error));
    }
  }

  return (
    <div className="searchbar-container">
      <AsyncPaginate
        placeholder="Enter a location"
        debounceTimeout={500} // delay API request for 500ms
        value={retrievedData}
        onChange={handleChange}
        loadOptions={loadSuggestions}
      />
    </div>
  );
}

export default SearchBar;