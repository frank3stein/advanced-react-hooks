// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

function counter({count}, action) {
  // if (typeof newState === 'function') {
  //   return newState(state)
  // }
  // return { ...state, ...newState };
  // return { ...state, ...(typeof newState === 'function' ? newState(state) : newState)}
  switch (action.type) {
    case "INCREMENT":
      return { count: count+ action.step }      
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function Counter({ initialCount = 0, step = 1 }) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  // const [count, setCount] = React.useState(initialCount)
  const [state, dispatch] = React.useReducer(counter, { count:initialCount})
  const { count } = state
  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  // const increment = () => setState(currentState => ({count:currentState.count + step}))
  const increment = () => dispatch({type:'INCREMENT', step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
