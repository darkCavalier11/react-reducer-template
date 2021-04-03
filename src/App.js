import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";
import axios from "axios";
import countryData from "./countrycode.json";

const locUrl = "http://www.geoplugin.net/json.gp";

const weatherUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=20&lon=85&appid=6b5ffe98c27d33b5196afde9158e1caa";

const iconUrl = "http://openweathermap.org/img/wn/ICON@2x.png";

const excUrl =
    "http://data.fixer.io/api/latest?access_key=a4a038b2b36d2f27633a21dc7c3f4e76";

function kelvinToCelsius(temp) {
    if (temp === 0) return "";
    return Math.round(temp - 273.15);
}

function getTomorrowDate(today) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

function App() {
    const [date, setDate] = useState(new Date());
    const day1 = getTomorrowDate(date);
    const day2 = getTomorrowDate(day1);
    const day3 = getTomorrowDate(day2);
    const [forecastDate, setforecastDate] = useState([day1, day2, day3]);
    const [center, setCenter] = useState([0, 0]);
    const [weather, setWeather] = useState([0, 0, 0]);
    const [country, setCountry] = useState("...");
    const [detail, setDetail] = useState([null, null, null, null]);

    const [exch, setExch] = useState(["...", 0, 0]);
    const minute = 60 * 1000;
    setInterval(() => {
        setDate(new Date());
        const day1 = getTomorrowDate(date);
        const day2 = getTomorrowDate(day1);
        const day3 = getTomorrowDate(day2);
        setforecastDate([day1, day2, day3]);
    }, minute);
    mapboxgl.accessToken =
        "pk.eyJ1Ijoic3VtaXRjIiwiYSI6ImNranJnbHM1MzF2OXQzMGw5OGV6MjlhZmsifQ.BXCa4SwcK7YtoVXdIVq9UQ";

    useEffect(async () => {
        try {
            const { data } = await axios.get(locUrl);
            setCountry(data.geoplugin_countryName);
            setCenter([data.geoplugin_longitude, data.geoplugin_latitude]);

            axios
                .get(weatherUrl)
                .then((res) => {
                    setWeather([
                        res.data.daily[0].temp.day,
                        res.data.daily[1].temp.day,
                        res.data.daily[2].temp.day,
                        res.data.daily[3].temp.day,
                    ]);
                    setDetail([
                        res.data.daily[0].weather[0],
                        res.data.daily[1].weather[0],
                        res.data.daily[2].weather[0],
                        res.data.daily[3].weather[0],
                    ]);
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        for (let i = 0; i < countryData.length; i++) {
            if (countryData[i].country === country) {
                const countryCode = countryData[i].currency_code;
                axios
                    .get(excUrl)
                    .then((res) => {
                        const inEuro = 1 / res.data.rates[countryCode];
                        const inDollar =
                            res.data.rates.USD / res.data.rates[countryCode];
                        setExch([
                            countryCode,
                            inDollar.toFixed(3),
                            inEuro.toFixed(3),
                        ]);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }
    }, [country]);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: center,
            zoom: 9,
        });
        const marker = new mapboxgl.Marker({ color: "black" })
            .setLngLat(center)
            .addTo(map);
    }, [center]);

    return (
        <div className="app">
            <div className="app-currency">
                <header>
                    <h1>{date.toDateString()}</h1>
                    <h2>{date.getHours() + ":" + date.getMinutes()}</h2>
                </header>
                <div>
                    <ul className="app-exchange">
                        <li>Your Currency | {exch[0]}</li>
                        <li>USD | {exch[1]}</li>
                        <li>EURO | {exch[2]}</li>
                    </ul>
                </div>
            </div>
            <div className="app-weather">
                <div className="weather-data">
                    <ul className="weather-li">
                        <li>
                            Today | {kelvinToCelsius(weather[0])}
                            <span>&deg; C</span>
                            <div className="weather-detail">
                                {detail[0] === null ? "..." : detail[0].main}{" "}
                                <img
                                    src={
                                        detail[0] === null
                                            ? "..."
                                            : iconUrl.replace(
                                                  "ICON",
                                                  detail[0].icon
                                              )
                                    }
                                ></img>
                            </div>
                        </li>
                        <li>
                            {forecastDate[0].toDateString()} |{" "}
                            {kelvinToCelsius(weather[1])}
                            <span>&deg; C</span>
                            <div className="weather-detail">
                                {detail[0] === null ? "..." : detail[1].main}{" "}
                                <img
                                    src={
                                        detail[0] === null
                                            ? "..."
                                            : iconUrl.replace(
                                                  "ICON",
                                                  detail[1].icon
                                              )
                                    }
                                ></img>
                            </div>
                        </li>
                        <li>
                            {forecastDate[1].toDateString()} |{" "}
                            {kelvinToCelsius(weather[2])}
                            <span>&deg; C</span>
                            <div className="weather-detail">
                                {detail[0] === null ? "..." : detail[2].main}{" "}
                                <img
                                    src={
                                        detail[0] === null
                                            ? "..."
                                            : iconUrl.replace(
                                                  "ICON",
                                                  detail[2].icon
                                              )
                                    }
                                ></img>
                            </div>
                        </li>
                        <li>
                            {forecastDate[2].toDateString()} |{" "}
                            {kelvinToCelsius(weather[3])}
                            <span>&deg; C</span>
                            <div className="weather-detail">
                                {detail[0] === null ? "..." : detail[3].main}{" "}
                                <img
                                    src={
                                        detail[0] === null
                                            ? "..."
                                            : iconUrl.replace(
                                                  "ICON",
                                                  detail[3].icon
                                              )
                                    }
                                ></img>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="map" id="map"></div>
            </div>
        </div>
    );
}

export default App;
