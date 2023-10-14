import React, { useState, useEffect } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import axios from "axios";
import "./Account.css";

const API_URL = "https://api.themoviedb.org/3/";

const Account = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/get-user-by-token",
          {
            headers: {
              token: localStorage.getItem("movie-app-token"),
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserData();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("movie-app-token")
  );
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const fetchFavoriteMovies = async () => {
    try {
      setIsLoading(true);

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
        const favorites = response.data.favorites || "";
        const favoriteIds = favorites.split(",");

        let movies = [];
        for (let i = 0; i < favoriteIds.length; i++) {
          const { data } = await axios.get(
            `${API_URL}/movie/${favoriteIds[i]}`,
            {
              params: {
                api_key: process.env.REACT_APP_API_KEY,
              },
            }
          );

          data.isFavorite = true;
          movies.push(data);
        }

        setFavoriteMovies(movies);
      } else {
        setFavoriteMovies([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      setFavoriteMovies([]);
      setIsLoading(false);
    }
  };

  const onModalClose = async () => {
    await fetchFavoriteMovies();
  };

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const renderFavoriteMovies = () => {
    // Check if favoriteMovies is undefined or empty before mapping over it
    if (!isLoading && (!favoriteMovies || favoriteMovies.length === 0)) {
      return (
        <h3 className="text">You haven't added any movie to favorites.</h3>
      );
    }

    return favoriteMovies.map((movie) => (
      <MovieCard
        key={movie.id}
        movie={movie}
        isFavorite={true}
        onModalClose={onModalClose}
      />
    ));
  };

  return (
    <div>
      <span className="pageTitle">Account</span>
      {Object.keys(userData).length > 0 ? (
        <div className="usersData">
          <p className="name">
            Name: {userData.firstName} {userData.lastName}
          </p>
          <p className="email">Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <h2>Favorites</h2>
      <div className="container">{renderFavoriteMovies()}</div>
    </div>
  );
};

export default Account;
