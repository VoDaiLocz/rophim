import { Injectable, Optional } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma.service";
import { Movie } from "../../domain/movie.entity";

@Injectable()
export class GetMoviesUseCase {
  private prisma: PrismaService;

  constructor(@Optional() prisma?: PrismaService) {
    this.prisma = prisma || new PrismaService();
  }

  async execute(): Promise<Movie[]> {
    const moviesData = await this.prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });

    return moviesData.map(
      (m) =>
        new Movie(
          m.id,
          m.title,
          m.slug,
          m.description || undefined,
          m.posterUrl || undefined,
          m.backdropUrl || undefined,
          m.releaseYear || undefined,
          m.imdbRating || undefined,
        ),
    );
  }
}
