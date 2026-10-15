import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <p>
      {text} {value}
    </p>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad;

  if (!good && !neutral && !bad) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <div>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {(good * 1 + neutral * 0 + bad * (-1))/total}</p>
      <p>positive {good/total * 100}%</p>
    </div>
  )
}


function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (setState) => {
    setState(prev => prev + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <button onClick={() => handleClick(setGood)}>good</button>
        <button onClick={() => handleClick(setNeutral)}>neutral</button>
        <button onClick={() => handleClick(setBad)}>bad</button>
      </div>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
