import Weather from "./Weather";

const CountryInfo = ({country, show}) => {
  console.log(country)

  if (show === false) return null
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.keys(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.svg} alt={`flag of ${country.flags.alt}`} />
      <Weather city={country.capital} />
    </div>
  )
}

export default CountryInfo;