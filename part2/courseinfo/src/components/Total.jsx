const Total = ({parts}) => {
  return (
    <p style={{fontWeight: "bold"}}>Total of exercises {parts.reduce((prev, curr) => prev + curr.exercises, 0)}</p>
  )
}

export default Total;