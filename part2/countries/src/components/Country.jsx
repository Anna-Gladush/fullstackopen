const Country = ({country}) => {
  console.log(country)

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.keys(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.svg} alt={`flag of ${country.flags.alt}`} />
    </>
  )
}

export default Country;