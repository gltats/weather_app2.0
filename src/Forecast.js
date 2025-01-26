import React, { useState, useEffect } from "react";
import "./Forecast.css";
import axios from "axios";
import moment from "moment-timezone";

let key = "58f070a40818f233c2b84bto089b72e4";

function Forecast({ city, unit }) {
	const [forecastData, setForecastData] = useState([]);
	const dates = [
		{ date: moment().add(1, "days").format("dddd") },
		{ date: moment().add(2, "days").format("dddd") },
		{ date: moment().add(3, "days").format("dddd") },
		{ date: moment().add(4, "days").format("dddd") },
		{ date: moment().add(5, "days").format("dddd") },
	];

	useEffect(() => {
		async function getForecast(city) {
			const url = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${key}`;
			try {
				const response = await axios.get(url);
				if (response.data && response.data.daily) {
					setForecastData(response.data.daily);
				}
			} catch (error) {
				console.error("Error fetching forecast:", error);
			}
		}
		if (city) {
			getForecast(city);
		}
	}, [city]);

	const convertTemperature = (temperature) => {
		return unit === "F"
			? (<>{Math.round(temperature)}<small> °F </small></>)
			: (<>{Math.round(temperature)}<small> °C </small></>);
	};


	return (
		<div className="Forecast">
			<hr />
			<div className="row">
				{forecastData.slice(0, 5).map((day, index) => (
					<div className="col" key={index}>
						<p style={{ marginBottom: "0", color:"#808080" }} >{dates[index]?.date}</p>
						<img	
								style={{ width: "60px", marginTop: "0" }}
								src={day.condition.icon_url}
								alt={day.condition.description}
						/>
						<div className="mb-4">
							{convertTemperature(day.temperature.minimum)}/{" "}{convertTemperature(day.temperature.maximum)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Forecast;
