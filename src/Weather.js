import React, { useState, useEffect } from "react";
import "./Weather.css";
import axios from "axios";
import moment from "moment-timezone";
import Forecast from "./Forecast.js";

let key = "58f070a40818f233c2b84bto089b72e4";
let geocodeKey = "c338d3cee1e64c8fabea67b04fa9fa45"; // OpenCage Geocoding API Key
let timezoneKey = "Y4U5DTNOVEYF"; // TimeZoneDB API Key

function Weather() {
	const [weatherCondition, setWeatherCondition] = useState("");
	const [city, setCity] = useState("Wolfsburg");
	const [timezone, setTimezone] = useState("");
	const [date, setDate] = useState(moment().format("dddd Do of MMMM YYYY, HH:mm:ss"));
	const [searchInput, setSearchInput] = useState("");
	const [error, setError] = useState("");
	const [temperature, setTemperature] = useState(null);
	const [weather, setWeather] = useState(null);
	const [humidity, setHumidity] = useState(null);
	const [wind, setWind] = useState(null);
	const [unit, setUnit] = useState("C");
	const [icon, setIcon] = useState(null);
	const [ready, setReady] = useState(false);

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

				const condition = response.data.condition.description.toLowerCase();
				if (condition.includes("few clouds")) {
				  setWeatherCondition("few-clouds");
				} else if (condition.includes("overcast clouds") || condition.includes("scattered clouds")) {
				  setWeatherCondition("scattered-clouds");
				} else if (condition.includes("broken clouds")) {
				  setWeatherCondition("broken-clouds");
				} else if (condition.includes("shower rain")) {
				  setWeatherCondition("shower-rain");
				} else if (condition.includes("rain")) {
					setWeatherCondition("rain");
				} else if (condition.includes("thunderstorm")) {
				  setWeatherCondition("stormy");
				} else if (condition.includes("snow")){
				  setWeatherCondition("snow");
				} else if (condition.includes("dust") || condition.includes("mist")){
				  setWeatherCondition("mist");
				} else if (condition.includes("clear sky")){
				  setWeatherCondition("sunny");
				}
				else
				{
					setWeatherCondition("sunny");
				}
				getCoordinates(cityName);
				setReady(true);
			} else {
				setError("City not found. Please enter a valid city.");
			}
		} catch (error) {
			setError("Something went wrong. Please try again.");
			console.error(error);
			setReady(false);
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
		fetchData(); //eslint-disable-next-line
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

	if (!ready) {
		return (
			<div className="Loader">
				<div className="flower-spinner">
					<div className="petal"></div>
					<div className="petal"></div>
					<div className="petal"></div>
					<div className="petal"></div>
					<div className="petal"></div>
					<div className="petal"></div>
					<div className="petal"></div>
					<div className="petal"></div>
				</div>
				<h3>Loading</h3>
			</div>
		);
	}

	return (
<div className={`Weather weather-background ${weatherCondition}`}>
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
          <p className="card-text">
            {weather !== null ? (
              weather
            ) : (
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </p>
          <div className="row m-2">
            <div className="col">
              {icon ? (
                <img src={icon} alt="weather icon" />
              ) : (
                <div className="spinner-grow text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              <p className="card-text"> </p>
              {temperature !== null ? (
                <>
                  {temperature}{" "}
                  <div className="btn btn-light" id="grades" onClick={toggleTemperatureUnit}>
                    °{unit}
                  </div>
                </>
              ) : (
                <div className="spinner-grow text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
			<div className="col mt-4">
			<p className="card-text">
				{humidity !== null ? (
				<>
					{humidity}% <i className="bi bi-moisture"></i>
				</>
				) : (
				<div className="spinner-grow text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				)}
			</p>
			<p className="card-text">
				{wind !== null ? (
				<>
					{wind} km/h <i className="bi bi-wind"></i>
				</>
				) : (
				<div className="spinner-grow text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				)}
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