import axios from "axios";

const baseURL = "https://api.openweathermap.org/data/2.5/weather?";
const api_key = import.meta.env.VITE_WEATHER_API_KEY;

const getWeather = (city) => {
  const request = axios
    .get(`${baseURL}q=${city}&units=metric&appid=${api_key}`)
    .catch((err) => console.log(err));

  return request.then((res) => {
    return res.data;
  });
};

export default { getWeather };
