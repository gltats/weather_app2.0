import React, { useState, useEffect } from "react";
import "./Forecast.css";
import axios from "axios";
import moment from "moment-timezone";


let key = "58f070a40818f233c2b84bto089b72e4";

function Forecast({ city }) {
  const [icon, setIcon] = useState("loading...");
  const [forecastData, setForecastData] = useState([]);
  let dates =
	[
		{date: moment().add(1, 'days').format("dddd")},
		{date: moment().add(2, 'days').format("dddd")},
		{date: moment().add(3, 'days').format("dddd")},
		{date: moment().add(4, 'days').format("dddd")},
		{date: moment().add(5, 'days').format("dddd")}
	];


  useEffect(() => {
    async function getForecast(city) {
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${key}`;
      try {
        const response = await axios.get(url);
        if (response.data && response.data.daily) {
          console.log(response.data.daily); // For debugging
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

  return (
    <div className="Forecast">
      <hr />
      <div className="row m-2 p-2">
        {forecastData.slice(0, 5).map((day, index) => (
          <div className="col" key={index}>
            <div className="row">{dates[index]?.date}</div>
            <div className="row">
              <img src={day.condition.icon_url} alt={day.condition.description} />
            </div>
            <div className="row">
              {Math.round(day.temperature.minimum)}° / {Math.round(day.temperature.maximum)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


//for debugging: forecast does not set farenheit
export default Forecast;
