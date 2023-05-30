import withResults from '../mocks/with-results.json'
import withoutResults from '../mocks/no-results.json'
import { useState } from 'react'

export function useMovies ({ search }) {
  const [responseMovies, setResponseMovies] = useState([])
  const movies = responseMovies.Search

  const mappedMovies = movies?.map(movie => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster,
  }))

  const getMovies = () => {
    if (search) {
      // setResponseMovies(withResults)
      fetch(`http://www.omdbapi.com/?apikey=4d9f0c24&s=${search}`)
      .then(response => response.json())
      .then(data => setResponseMovies(data))
    } else {
      setResponseMovies(withoutResults)
    }
  }

  return { movies: mappedMovies, getMovies }
}