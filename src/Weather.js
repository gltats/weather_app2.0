import React, { useState, useEffect } from "react";
import "./Weather.css";
import axios from "axios";
import moment from "moment-timezone";
import Forecast from "./Forecast.js";

let key = "58f070a40818f233c2b84bto089b72e4";
let geocodeKey = "c338d3cee1e64c8fabea67b04fa9fa45"; // OpenCage Geocoding API Key
let timezoneKey = "Y4U5DTNOVEYF"; // TimeZoneDB API Key

function Weather() {
  const [city, setCity] = useState("Wolfsburg");
  const [timezone, setTimezone] = useState("");
  const [date, setDate] = useState(moment().format("dddd Do of MMMM YYYY, HH:mm:ss"));
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
        setCity(response.data.city);
        setTemperature(Math.round(response.data.temperature.current));
        setWeather(response.data.condition.description);
        setHumidity(response.data.temperature.humidity);
        setWind(Math.round(response.data.wind.speed));
        setIcon(response.data.condition.icon_url);
        setError("");
        getCoordinates(cityName);
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

  async function getCoordinates(cityName) {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${geocodeKey}`
      );
      const { lat, lng } = response.data.results[0].geometry;
      getTimezone(lat, lng);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  }

  // Fetch timezone using coordinates
  async function getTimezone(lat, lng) {
    try {
      const response = await axios.get(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneKey}&format=json&by=position&lat=${lat}&lng=${lng}`
      );
      const timezoneData = response.data.zoneName;
      setTimezone(timezoneData);
      setDate(moment().tz(timezoneData).format("dddd Do of MMMM YYYY, HH:mm:ss"));
    } catch (error) {
      console.error("Error fetching timezone:", error);
    }
  }

  useEffect(() => {
	const fetchData = async () => {
	  await getData("Wolfsburg");
	};
  
	fetchData();// eslint-disable-next-line
  }, []);

  useEffect(() => {
	if (timezone) {
	  const updateDate = () => {
		setDate(moment().tz(timezone).format("dddd Do of MMMM YYYY, HH:mm:ss"));
	  };
	  updateDate();
	  const interval = setInterval(updateDate, 1000);
	  return () => clearInterval(interval);
	}
  }, [timezone]);

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
            <i className="bi bi-search"></i>
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
              <p className="card-text"> </p>
              {temperature} <div className="btn btn-light" id="grades" onClick={toggleTemperatureUnit}>
                °{unit}
              </div>
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
        <Forecast city={city} unit={unit} toggleTemperatureUnit={toggleTemperatureUnit} />
      </div>
    </div>
  );
}

export default Weather;
