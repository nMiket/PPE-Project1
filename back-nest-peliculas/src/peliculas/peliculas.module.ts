import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [PeliculasController],
  providers: [PeliculasService],
  imports: [PrismaModule],
})
export class PeliculasModule {}
