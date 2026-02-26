import { MovieModel, IMovie } from "../models/movie.model";

export interface PaginatedMoviesResult {
  movies: IMovie[];
  total: number;
}

export class MovieRepository {
  async create(data: Partial<IMovie>): Promise<IMovie> {
    const movie = new MovieModel(data);
    await movie.save();
    return movie;
  }

  async findById(id: string): Promise<IMovie | null> {
    return MovieModel.findById(id).lean();
  }

  async findPaginated(
    skip: number,
    limit: number,
    search?: string
  ): Promise<PaginatedMoviesResult> {
    const filter = search?.trim()
      ? { title: { $regex: search.trim(), $options: "i" } }
      : {};
    const [movies, total] = await Promise.all([
      MovieModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MovieModel.countDocuments(filter),
    ]);
    return { movies: movies as IMovie[], total };
  }

  async update(id: string, data: Partial<IMovie>): Promise<IMovie | null> {
    return MovieModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await MovieModel.findByIdAndDelete(id);
    return !!result;
  }
}
