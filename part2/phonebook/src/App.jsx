import { useState, useEffect } from "react";
import personService from "./services/persons"
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
    const personObject = {name: newName, number: newNumber}

    if (persons.find(person => person.name === newName)) {
      const id = persons.find(person => person.name === newName).id
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(id, personObject).then(returnedPerson => {
          setPersons(persons.map(person => person.id === id ? returnedPerson : person))
        })
        return
      }
    }
    personService
      .create(personObject)
      .then(res => {
        console.log(res)
        setPersons(persons.concat(res));
        setNewName("");
        setNewNumber("");
      })
      .catch((err) => console.log(err))
  }

  const remove = (id) => {
    personService.remove(id);
    setPersons(persons.filter(n => n.id !== id))
  }
  
  useEffect(() => {
    personService
      .getAll()
      .then(people => {
        setPersons(people)
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
      <Persons persons={persons} remove={remove}/>
    </div>
    </>
  )
}

export default App
