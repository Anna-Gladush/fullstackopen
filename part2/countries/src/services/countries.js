import axios from "axios";

const getCountries = () => {
  const request = axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all/`)
    .catch((err) => console.log(err));

  return request.then((res) => {
    return res.data;
  });
};

export default { getCountries };
