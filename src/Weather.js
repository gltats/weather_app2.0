import React, { useState, useEffect } from "react";
import "./Weather.css";
import axios from "axios";
import moment from "moment-timezone";

let key = "58f070a40818f233c2b84bto089b72e4";

function Weather() {
  const [date, setDate] = useState(moment().tz("Europe/Berlin").format("dddd Do of MMMM YYYY, HH:mm:ss"));
  const [city, setCity] = useState("Berlin");
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [temperature, setTemperature] = useState("loading...");
  const [weather, setWeather] = useState("loading...");
  const [humidity, setHumidity] = useState("loading...");
  const [wind, setWind] = useState("loading...");
  const [unit, setUnit] = useState("C");
  const [icon, setIcon] = useState("loading...");

  function handleInputChange(event) {
    setSearchInput(event.target.value);
    setError("");
  }

  function toggleTemperatureUnit() {
    if (unit === "C") {
      setTemperature((prevTemp) => Math.round(prevTemp * 1.8 + 32));
      setUnit("F");
    } else {
      setTemperature((prevTemp) => Math.round((prevTemp - 32) / 1.8));
      setUnit("C");
    }
  }

  async function getData(cityName) {
    const url = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${key}`;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.status !== "not_found") {
        console.log(response.data); 
        setCity(response.data.city);
        setTemperature(Math.round(response.data.temperature.current));
        setWeather(response.data.condition.description);
        setHumidity(response.data.temperature.humidity);
        setWind(Math.round(response.data.wind.speed));
		setIcon(response.data.condition.icon_url);
        setError(""); 
      } else {
        setError("City not found. Please enter a valid city.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error); 
    }
  }

  function handleSearch() {
    if (searchInput.trim() === "") {
      setError("Please enter a city name.");
      return;
    }
    getData(searchInput.trim());
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  useEffect(() => {
    getData("Berlin");
    const interval = setInterval(() => {
      setDate(moment().tz("Europe/Berlin").format("dddd Do of MMMM YYYY, HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Weather">
      <h1>Weather App</h1>
      <p>Find the weather for your city</p>
      <div className="card m-3">
        <div className="input-group m-2">
          <input
            className="form-control"
            placeholder="Type to search..."
            type="search"
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            value={searchInput}
            id="search"
          />
          <button className="btn btn-light searchButton" id="search" type="button" onClick={handleSearch}>
		 	 <i class="bi bi-search"></i>
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="card-body">
          <h5 className="card-title" id="CityName">
            {city}
          </h5>
          <p id="Date">{date}</p>
          <p className="card-text">{weather}</p>
          <div className="row m-2">
            <div className="col">
              <img src={icon} alt="weather icon" />
              <p className="card-text">
                {temperature} <div className="btn btn-light" id="grades" onClick={toggleTemperatureUnit}>
                  °{unit}
                </div>
              </p>
            </div>
            <div className="col mt-4">
              <p className="card-text">
                {humidity}% <i className="bi bi-moisture"></i>
              </p>
              <p className="card-text">
                {wind} km/h <i className="bi bi-wind"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
