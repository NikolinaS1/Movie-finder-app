import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/MovieCard/MovieCard";
import CustomPagination from "../../components/Pagination/CustomPagination";

const TopRated = () => {
  const API_URL = "https://api.themoviedb.org/3/";
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);

  const fetchTrending = async () => {
    const {
      data: { results },
    } = await axios.get(`${API_URL}/movie/top_rated`, {
      params: {
        api_key: process.env.REACT_APP_API_KEY,
        page: page,
      },
    });
    
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
  };

  useEffect(() => {
    fetchTrending();
  }, [page]);

  const renderMovies = () => {
    return movies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
  };

  return (
    <div>
      <span className="pageTitle">Top rated</span>
      <div className="container">{renderMovies()}</div>
      <CustomPagination setPage={setPage} />
    </div>
  );
};

export default TopRated;
