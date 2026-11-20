const Notification = ({ message }) => {
  const color = message.type === 'error' ? 'red' : 'green'
  const style = {
    color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  return (
    <p style={style} className="error">{message.description}</p>
  )
}

export default Notification