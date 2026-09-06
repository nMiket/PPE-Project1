export class CreatePeliculaDto {
	title!: string;
	director!: string;
	cast!: string;
	genre!: string;
	ageRating!: string;
	releaseDate?: string | null;
	durationMinutes!: number;
	synopsis!: string;
	country!: string;
	originalLanguage!: string;
	rating!: number;
	image!: string;
}
