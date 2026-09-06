import { http } from '../api/http'
import type { Movie } from '../types/movie'

interface ApiMovie {
  id: number
  title: string
  director: string
  cast: string
  genre: string
  ageRating: string
  releaseDate: string | null
  durationMinutes: number
  synopsis: string
  country: string
  originalLanguage: string
  rating: number
  image: string
}

type MoviePayload = Omit<ApiMovie, 'id'>

const toMovie = (movie: ApiMovie): Movie => ({
  id: movie.id,
  titulo: movie.title,
  director: movie.director,
  reparto: movie.cast,
  genero: movie.genre,
  clasificacion_edad: movie.ageRating,
  fecha_estreno: movie.releaseDate?.slice(0, 10) ?? '',
  duracion: movie.durationMinutes,
  sinopsis: movie.synopsis,
  poster_url: movie.image,
  calificacion: movie.rating,
  idioma: movie.originalLanguage,
  pais: movie.country,
})

const toPayload = (movie: Omit<Movie, 'id'>): MoviePayload => ({
  title: movie.titulo,
  director: movie.director,
  cast: movie.reparto,
  genre: movie.genero,
  ageRating: movie.clasificacion_edad,
  releaseDate: movie.fecha_estreno || null,
  durationMinutes: movie.duracion,
  synopsis: movie.sinopsis,
  country: movie.pais,
  originalLanguage: movie.idioma,
  rating: movie.calificacion,
  image: movie.poster_url,
})

export async function getMovies() {
  const { data } = await http.get<ApiMovie[]>('/peliculas')
  return data.map(toMovie)
}

export async function getMovie(id: number) {
  const { data } = await http.get<ApiMovie>(`/peliculas/${id}`)
  return toMovie(data)
}

export async function createMovie(movie: Omit<Movie, 'id'>) {
  const { data } = await http.post<ApiMovie>('/peliculas', toPayload(movie))
  return toMovie(data)
}

export async function updateMovie(id: number, movie: Omit<Movie, 'id'>) {
  const { data } = await http.patch<ApiMovie>(`/peliculas/${id}`, toPayload(movie))
  return toMovie(data)
}

export async function deleteMovie(id: number) {
  await http.delete(`/peliculas/${id}`)
}
