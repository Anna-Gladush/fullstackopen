import Country from "./Country";

const CountryList = ({countries}) => {
  return (
    <>
      {countries.map(country => {
        return (
          <Country country={country} key={country.name.common} />
        )
      })}
    </>
  )
}

export default CountryList;