import { useEffect, useState } from 'react';
import CountryList from './components/CountryList';
import countriesService from "./services/countries"
import CountryInfo from './components/CountryInfo';

function App() {
  const [countryList, setCountryList] = useState(null);
  const [searchedCountry, setSearchedCountry] = useState([])

  useEffect(() => {
    countriesService
      .getCountries()
      .then(res => {
        console.log(res)
        setCountryList(res)
      })
  }, [])
  
  const searchHandle = (e) => {
    setSearchedCountry(countryList.filter(country => country.name.common.toLowerCase().includes(e.target.value)));
    console.log(searchedCountry)
  }

  if (!countryList) return "Loading..."
  return (
    <div>
      <label>find countries <input type="text" onChange={(e) => searchHandle(e)}/></label>
      {searchedCountry.length > 10 ? (<p>Too many matches, specify another filter</p>) : (searchedCountry.length > 1 ? (<CountryList countries={searchedCountry} />) : (searchedCountry.length === 1 ? <CountryInfo country={searchedCountry[0]} show={true} /> : null))}
    </div>
  )
}

export default App
