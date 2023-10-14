import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/MovieCard/MovieCard";
import CustomPagination from "../../components/Pagination/CustomPagination";
import "./Genres.css";

const Genres = () => {
  const API_URL = "https://api.themoviedb.org/3/";
  const [page, setPage] = useState(1);
  const [genreId, setGenreId] = useState(0); // Set 0 for "All Movies"
  const [sortBy, setSortBy] = useState("popularity.desc"); // Default sort by popularity
  const [numOfPages, setNumOfPages] = useState(0);
  const [movies, setMovies] = useState([]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/discover/movie`, {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          with_genres: genreId !== 0 ? genreId : undefined, // Remove the parameter if genreId is 0
          sort_by: sortBy,
          page: page,
        },
      });

      let results = response.data.results;
      const token = localStorage.getItem("movie-app-token");

      if (token) {
        const userResponse = await axios.get(`http://localhost:5000/api/get-user-by-token`, {
          headers: { token: token }
        });
  
        if (userResponse.data) {
          const favorites = userResponse.data.favorites || '';
          results.forEach(function (item) {
            item.isFavorite = favorites.split(',').includes(item.id.toString());
          });
        }
      }

      setMovies(results);
      setNumOfPages(response.data.total_pages);
    } catch (error) {
      console.log("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [page, genreId, sortBy]);

  const handleGenreChange = (event) => {
    setGenreId(parseInt(event.target.value)); // Parse the value to an integer
    setPage(1); // Reset page to 1 when changing the genre
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Reset page to 1 when changing the sorting criteria
  };

  const renderMovies = () => {
    return movies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
  };

  return (
    <div>
      <span className="pageTitle">Movies by genres</span>
      <div className="dropdown">
        <div className="menu">
          <select value={genreId} onChange={handleGenreChange}>
            <option value={0}>All Movies</option>
            <option value={28}>Action</option>
            <option value={12}>Adventure</option>
            <option value={16}>Animation</option>
            <option value={35}>Comedy</option>
            <option value={80}>Crime</option>
            <option value={18}>Drama</option>
            <option value={10751}>Family</option>
            <option value={14}>Fantasy</option>
            <option value={27}>Horror</option>
            <option value={9648}>Mystery</option>
            <option value={10749}>Romance</option>
            <option value={878}>Science Fiction</option>
            <option value={53}>Thriller</option>
            <option value={10752}>War</option>
            <option value={37}>Western</option>
          </select>
        </div>
        <div className="menu">
          <select value={sortBy} onChange={handleSortByChange}>
            <option value="popularity.desc">Sort by Popularity</option>
            <option value="vote_average.desc">Sort by Rating</option>
          </select>
        </div>
      </div>
      <div className="container">{renderMovies()}</div>
      <CustomPagination setPage={setPage} numberOfPages={numOfPages} />
    </div>
  );
};

export default Genres;
