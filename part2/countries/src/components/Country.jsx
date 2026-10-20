import { useState } from "react";
import CountryInfo from "./CountryInfo";

const Country = ({country}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <p>{country.name.common}</p>
      <button onClick={() => setShow(prev => !prev)}>{show ? "hide" : "show"}</button>
      <CountryInfo country={country} show={show}/>
    </>
  )
}

export default Country