const PersonForm = ({savePersons, newName, setNewName, newNumber, setNewNumber}) => {
  return (
      <form onSubmit={(e)=> savePersons(e)}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <label id="name">
            name: <input id="name" value={newName} onChange={(e) => setNewName(e.target.value)}/>
          </label>
          <label id="number">number: <input id="number" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></label>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default PersonForm;