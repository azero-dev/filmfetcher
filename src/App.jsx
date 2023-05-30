import './App.css'
import { useMovies } from './hooks/useMovies.js'
import { Movies } from './components/Movies.jsx'
import { useState, useEffect, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('Cant search an empty film')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('Cant search a number')
      return
    }
    if (search.length < 3) {
      setError('Cant search less than 3 characters')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({search, sort})

  const debounceGetMovies = useCallback(
    debounce((search) => {
      console.log("searching", search);
      getMovies({ search });
    }, 500),
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debounceGetMovies( newSearch )
  }

  return (
    <div className='page'>
    <header>
      <h1>Filmfetcher</h1>
      <form className='form' onSubmit={handleSubmit} >
        <input onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wars, etc.' />
        <input type='checkbox' onChange={handleSort} checked={sort} />
        <button type='submit'>Search</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </header>
    <main>
      {
        loading
        ? <p>Loading...</p>
        : <Movies movies={movies} />
      }
    </main>
    </div>
  )
}

export default App
