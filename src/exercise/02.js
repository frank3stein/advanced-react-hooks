// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 🐨 this is going to be our generic asyncReducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useSafeDispatch(dispatch) {
  const mountRef = React.useRef(false)

  React.useLayoutEffect(() => { // this will run before the paint, as soon as it is mounted
    mountRef.current = true
    return () => {
      mountRef.current = false
    }
  })

  return React.useCallback((...args) => {
    if (mountRef.current) {
      dispatch(...args)
    }
  }, [])
}

const useAsync = (initialState) => {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, initialState)
  const dispatch = useSafeDispatch(unsafeDispatch)
  const run = React.useCallback(promise => {
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, [])
  // React.useEffect(() => {
      
  //   const promise = fetchAsync()
  //   if (!promise) {
  //     return
  //   }  
      
  //   dispatch({type: 'pending'})
  //   promise.then(
  //     data => {
  //       console.log(data)
  //       dispatch({type: 'resolved', data})
  //     },
  //     error => {
  //       dispatch({type: 'rejected', error})
  //     },
  //   )
  //   }, [fetchAsync]) // Since we use useCallback to keep track of changes in the function, we can instead use it as dependency. Otherwise with each render since a new function is created useEffect will run always
  return {...state, run};
}

function PokemonInfo({ pokemonName }) {
  // const asyncCallback = React.useCallback(
  // () => {
  //     if (!pokemonName) {
  //       return
  //     }
  //     return fetchPokemon(pokemonName)
  //   },
  //   [pokemonName]
  // )
  const { data: pokemon, status, error, run } = useAsync(
    { status: pokemonName ? 'pending' : 'idle', pokemon: null, error: null }
  )

  React.useEffect(() => {
    if (!pokemonName) {
        return
      }
      return run(fetchPokemon(pokemonName))
    },
    [pokemonName, run]
  )

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
