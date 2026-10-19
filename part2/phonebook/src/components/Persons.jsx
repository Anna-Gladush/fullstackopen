const Persons = ({persons, remove}) => {
  return (
    <>
      {persons.map(person => { 
        return (
          <div key={person.id}>
            <p>{person.name} {person.number}</p>
            <button onClick={() => {
              if (window.confirm("Do you want to delete this person?")) {
                remove(person.id)
              }
              }}>delete</button>
          </div>
        )
      })}
    </>
  )
}

export default Persons;