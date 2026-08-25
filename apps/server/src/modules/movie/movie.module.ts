import { Module } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { GetMoviesUseCase } from "./application/use-cases/get-movies.use-case";
import { MovieController } from "./infrastructure/movie.controller";

@Module({
  controllers: [MovieController],
  providers: [PrismaService, GetMoviesUseCase],
  exports: [GetMoviesUseCase],
})
export class MovieModule {}
