import { useEffect, useState } from "react";
import weatherServices from "../services/weather"
const Weather = ({city}) => {
  const [weather, setWeather] = useState(null)
  console.log(city)
  useEffect(() => {
    weatherServices.getWeather(city).then(res => {
      setWeather(res);
    })
  }, [city])

  if (!weather) return <p>Fetching weather data...</p>
  console.log(weather)
  return (
    <>
      <h2>Weather in {weather.name}</h2>
      <p>Temperature {weather.main.temp} Celcius</p>
      <p style={{textTransform: "capitalize"}}>{weather.weather[0].description}</p>
      <img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`} alt="weather icon" />
      <p>Wind {weather.wind.speed} m/s</p>
    </>
  )
}

export default Weather;