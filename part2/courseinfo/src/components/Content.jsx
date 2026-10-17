import Part from "./Part";

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => {
        return (
          <Part key={part.name} part={part.name} exercises={part.exercises} />
        )
      })}
    </div>
  )
}

export default Content;