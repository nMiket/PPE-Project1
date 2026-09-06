-- CreateTable
CREATE TABLE "Pelicula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "ageRating" TEXT NOT NULL,
    "releaseDate" DATETIME,
    "durationMinutes" INTEGER NOT NULL,
    "synopsis" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "originalLanguage" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
