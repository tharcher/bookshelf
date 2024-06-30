import mongoose from "mongoose";
import { MovieDto } from "../../app/dto/movieDto";
import { MoviesRepository } from "../../app/repository/movies.repository";
import { MovieEntity } from "../../domain/entity/movie.entity";
import { title } from "process";

const moviesSchema = new mongoose.Schema({
    title: String,
    release: Date,
    duration: Number,
    thumbnailUrl: String,
    shortDescription: String,
    longDescription: String,
    status: String,
    directors: [String],
    cast: [String],
    categories: [String],
});

const Movies = mongoose.model('movies', moviesSchema);

class MoviesRepositoryMongoose implements MoviesRepository {
    create(dto: MovieDto) {
        const movie = new Movies(dto);
        return movie.save();
    }

    async find(
        search: string,
        embedding: number[],
        matchMovies: Record<string, any>,
    ): Promise<MovieEntity[] | null> {
        const response = await Movies.aggregate([
            {
                $vectorSearch: {
                    index: 'embedding',
                    path: 'embedding',
                    queryVector: embedding,
                    numCandidates: 150,
                    limit: 10,
                },
            }, 
            {
                $match: {
                    $or: [
                        { title: new RegExp(matchMovies.title, 'i') },
                        { directors: new RegExp(matchMovies.directors, 'i') },
                        { categories: new RegExp(matchMovies.categories, 'i') },
                        { cast: new RegExp(matchMovies.cast, 'i') },
                        { longDescription: new RegExp(matchMovies.longDescription, 'i') },                        
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    release: 1,
                    duration: 1,
                    thumbnailUrl: 1,
                    shortDescription: 1,
                    longDescription: 1,
                    status: 1,
                    directors: 1,
                    cast: 1,
                    categories: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ]);
        
        return response;
    }

    async update(dto: MovieDto, id: string): Promise<MovieEntity | null> {
        const response = await Movies.findByIdAndUpdate(id, dto);
        return response ? response.toObject() : null;
    }
}

export { MoviesRepositoryMongoose };  