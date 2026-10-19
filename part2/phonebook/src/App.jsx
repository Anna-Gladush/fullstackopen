import { useState, useEffect } from "react";
import axios from 'axios';
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

function App() {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const savePersons = (e) => {
    e.preventDefault();
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} already added to the phonebook`);
      return;
    }
    setPersons(prev => [...prev, {name: newName, number: newNumber, id: persons.length + 1}]);
  }
  
  useEffect(() => {
    axios
    .get("http://localhost:3001/persons")
    .then(res => {
      console.log(res)
      setPersons(res.data)
    })
  }, [])


  return (
    <>
      <div>
      <h2>Phonebook</h2>
      <Filter search={search} setSearch={setSearch} persons={persons} />
      <h3>Add a new</h3>
      <PersonForm savePersons={savePersons} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}/>
      <h3>Numbers</h3>
      <Persons persons={persons} />
    </div>
    </>
  )
}

export default App
