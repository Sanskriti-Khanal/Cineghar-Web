import { MovieRepository } from "../../repositories/movie.repository";
import type { CreateMovieDto, UpdateMovieDto } from "../../dtos/movie.dto";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { HttpError } from "../../errors/http-error";

const movieRepository = new MovieRepository();

export class AdminMovieService {
  async create(data: CreateMovieDto & { releaseDate?: string }) {
    const payload: Record<string, unknown> = {
      title: data.title,
      description: data.description,
      genre: data.genre ?? [],
      duration: data.duration,
      rating: data.rating,
    };
    if (data.posterUrl) payload.posterUrl = data.posterUrl;
    if (data.releaseDate) payload.releaseDate = new Date(data.releaseDate);
    return movieRepository.create(payload as Parameters<typeof movieRepository.create>[0]);
  }

  async getOne(id: string) {
    const movie = await movieRepository.findById(id);
    if (!movie) throw new HttpError(404, "Movie not found");
    return movie;
  }

  async getPaginated(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const { movies, total } = await movieRepository.findPaginated(skip, limit);
    const totalPages = Math.ceil(total / limit);
    return { data: movies, total, page, limit, totalPages };
  }

  async update(id: string, data: UpdateMovieDto) {
    const movie = await movieRepository.findById(id);
    if (!movie) throw new HttpError(404, "Movie not found");
    const payload: Record<string, unknown> = { ...data };
    if (data.releaseDate !== undefined) {
      payload.releaseDate = data.releaseDate ? new Date(data.releaseDate) : undefined;
    }
    const updated = await movieRepository.update(id, payload as Parameters<typeof movieRepository.update>[1]);
    if (!updated) throw new HttpError(500, "Failed to update movie");
    return updated;
  }

  async delete(id: string) {
    const movie = await movieRepository.findById(id);
    if (!movie) throw new HttpError(404, "Movie not found");
    const ok = await movieRepository.delete(id);
    if (!ok) throw new HttpError(500, "Failed to delete movie");
    return true;
  }
}
