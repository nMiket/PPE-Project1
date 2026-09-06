import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PeliculasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPeliculaDto: CreatePeliculaDto) {
    return this.prisma.pelicula.create({
      data: {
        ...createPeliculaDto,
        releaseDate: this.parseReleaseDate(createPeliculaDto.releaseDate),
      },
    });
  }

  findAll() {
    return this.prisma.pelicula.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const pelicula = await this.prisma.pelicula.findUnique({ where: { id } });
    if (!pelicula) {
      throw new NotFoundException(`No existe la pelicula con id ${id}`);
    }
    return pelicula;
  }

  async update(id: number, updatePeliculaDto: UpdatePeliculaDto) {
    await this.findOne(id);

    const { releaseDate, ...data } = updatePeliculaDto;
    return this.prisma.pelicula.update({
      where: { id },
      data: {
        ...data,
        ...(releaseDate !== undefined && {
          releaseDate: this.parseReleaseDate(releaseDate),
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pelicula.delete({ where: { id } });
  }

  private parseReleaseDate(releaseDate?: string | null): Date | null {
    if (!releaseDate) {
      return null;
    }

    const parsedDate = new Date(releaseDate);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('releaseDate debe ser una fecha válida');
    }
    return parsedDate;
  }
}
