const Filter = ({search, setSearch, persons}) => {
  const searchFilter = persons.filter(person => person.name.toLowerCase().includes(search))
  return (
    <div className="search">
      <label id="search">filter shown with a <input id="search" value={search} onChange={(e) => setSearch(e.target.value)}/></label>
      {search === "" ? "" : searchFilter.map(person => <p key={person.id}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default Filter;