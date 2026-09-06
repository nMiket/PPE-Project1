import { reactive } from 'vue'
import type { Movie } from '../types/movie'

const movies = reactive<Movie[]>([
  {
    id: 1,
    titulo: 'Interstellar',
    director: 'Christopher Nolan',
    reparto: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    genero: 'Ciencia ficción',
    clasificacion_edad: '12+',
    fecha_estreno: '2014-11-07',
    duracion: 169,
    sinopsis:
      'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    calificacion: 8.7,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
  {
    id: 2,
    titulo: 'The Batman',
    director: 'Matt Reeves',
    reparto: 'Robert Pattinson, Zoë Kravitz, Paul Dano',
    genero: 'Acción',
    clasificacion_edad: '13+',
    fecha_estreno: '2022-03-04',
    duracion: 176,
    sinopsis:
      'Batman investiga una serie de asesinatos que revelan una conspiración relacionada con Gotham City.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    calificacion: 7.8,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
  {
    id: 3,
    titulo: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    reparto: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
    genero: 'Acción',
    clasificacion_edad: '13+',
    fecha_estreno: '2019-04-26',
    duracion: 181,
    sinopsis:
      'Los Avengers restantes deben encontrar una manera de revertir las consecuencias del chasquido de Thanos.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    calificacion: 8.4,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
  {
    id: 4,
    titulo: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    reparto: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
    genero: 'Acción',
    clasificacion_edad: '13+',
    fecha_estreno: '2019-04-26',
    duracion: 181,
    sinopsis:
      'Los Avengers restantes deben encontrar una manera de revertir las consecuencias del chasquido de Thanos.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    calificacion: 8.4,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
  {
    id: 5,
    titulo: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    reparto: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
    genero: 'Acción',
    clasificacion_edad: '13+',
    fecha_estreno: '2019-04-26',
    duracion: 181,
    sinopsis:
      'Los Avengers restantes deben encontrar una manera de revertir las consecuencias del chasquido de Thanos.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    calificacion: 8.4,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
  {
    id: 6,
    titulo: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    reparto: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
    genero: 'Acción',
    clasificacion_edad: '13+',
    fecha_estreno: '2019-04-26',
    duracion: 181,
    sinopsis:
      'Los Avengers restantes deben encontrar una manera de revertir las consecuencias del chasquido de Thanos.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    calificacion: 8.4,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
  {
    id: 7,
    titulo: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    reparto: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
    genero: 'Acción',
    clasificacion_edad: '13+',
    fecha_estreno: '2019-04-26',
    duracion: 181,
    sinopsis:
      'Los Avengers restantes deben encontrar una manera de revertir las consecuencias del chasquido de Thanos.',
    poster_url:
      'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    calificacion: 8.4,
    idioma: 'Inglés',
    pais: 'Estados Unidos',
  },
])

export function useMoviesStore() {
  const getMovieById = (id: number) => {
    return movies.find((movie) => movie.id === id)
  }

  const addMovie = (movie: Omit<Movie, 'id'>) => {
    const newId =
      movies.length > 0
        ? Math.max(...movies.map((movie) => movie.id)) + 1
        : 1

    movies.push({
      id: newId,
      ...movie,
    })
  }

  const updateMovie = (updatedMovie: Movie) => {
    const index = movies.findIndex(
      (movie) => movie.id === updatedMovie.id,
    )

    if (index !== -1) {
      movies[index] = updatedMovie
    }
  }

  const deleteMovie = (id: number) => {
    const index = movies.findIndex((movie) => movie.id === id)

    if (index !== -1) {
      movies.splice(index, 1)
    }
  }

  return {
    movies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
  }
}