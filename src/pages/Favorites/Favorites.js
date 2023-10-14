import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import axios from "axios";
import "./Favorites.css";

const API_URL = "https://api.themoviedb.org/3/";

const Favorites = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("movie-app-token")
  );
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const fetchFavoriteMovies = async () => {
    try {
      const token = localStorage.getItem("movie-app-token");
      if (!token) {
        console.log("User not logged in");
        setFavoriteMovies([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/get-user-by-token",
        {
          headers: { token: token },
        }
      );
      if (response.status === 200) {
        const favorites = response.data.favorites || '';
        const favoriteIds = favorites.split(',');

        let movies = [];
        for (let i = 0; i<favoriteIds.length; i++) {
          const { data } = await axios.get(`${API_URL}/movie/${favoriteIds[i]}`, {
            params: {
              api_key: process.env.REACT_APP_API_KEY,
            },
          });
          
          data.isFavorite = true;
          movies.push(data);
        }
        
        setFavoriteMovies(movies);
      } else {
        setFavoriteMovies([]);
      }
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      setFavoriteMovies([]);
    }
  };

  const onModalClose = async () => {
    await fetchFavoriteMovies();
  }

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const renderFavoriteMovies = () => {
    // Check if favoriteMovies is undefined or empty before mapping over it
    if (!favoriteMovies || favoriteMovies.length === 0) {
      return (
        <p className="favoriteText">
          You haven't added any movie to favorites.
        </p>
      );
    }

    return favoriteMovies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} isFavorite={true} onModalClose={onModalClose} />
    ));
  };

  return (
    <div className="favorites-page">
      <h1 className="pageTitle">Favorites</h1>
      <div className="movieGrid">{renderFavoriteMovies()}</div>
    </div>
  );
};

export default Favorites;
