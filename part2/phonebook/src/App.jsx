import { useState } from "react"
function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  }

  const savePersons = (e) => {
    e.preventDefault();
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} already added to the phonebook`);
      return;
    }
    setPersons(prev => [...prev, {name: newName, number: newNumber, id: persons.length + 1}]);
  }

  const searchFilter = persons.filter(person => person.name === search)
  
  return (
    <>
      <div>
      <h2>Phonebook</h2>
      <div className="search">
        <label>filter shown with a <input value={search} onChange={(e) => handleInputChange(e, setSearch)}/></label>
        {searchFilter.map(person => <p key={person.id}>{person.name} {person.number}</p>)}
      </div>
      <form onSubmit={(e)=> savePersons(e)}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <label>
            name: <input value={newName} onChange={(e) => handleInputChange(e, setNewName)}/>
          </label>
          <label>number: <input value={newNumber} onChange={(e) => handleInputChange(e, setNewNumber)} /></label>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => {
        return (
          <p key={person.id}>{person.name} {person.number}</p>
        )
      })}
    </div>
    </>
  )
}

export default App
