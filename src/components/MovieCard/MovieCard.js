import { img_300, unavailable } from "../../config/config";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import "./MovieCard.css";
import ContentModal from "../ContentModal/ContentModal";

const MovieCard = ({
  movie,
  onModalClose
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("movie-app-token")
  );

  const [isFavorite, setIsFavorite] = useState(movie.isFavorite);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddToFavorites = async () => {
    try {
      const token = localStorage.getItem("movie-app-token");
      if (!token) {
        console.log("User not logged in");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/favorite",
        { favoriteId: movie.id },
        { headers: { token: token } }
      );

      if (response.status === 200) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  return (
    <ContentModal
      id={movie.id}
      isLoggedIn={isLoggedIn}
      onFavoriteChange={handleAddToFavorites}
      isFavorite={isFavorite}
      onClose={onModalClose}
    >
      <img
        className="poster"
        src={
          movie.poster_path ? `${img_300}/${movie.poster_path}` : unavailable
        }
        alt={movie.title}
      />
      <b className="title">{movie.title}</b>
      <div className="subTitleContainer">
        <div className="subTitleItem">
          <IconButton>
            <StarIcon fontSize="small" />
          </IconButton>
          <span className="subTitle">
            {movie.vote_average > 0 ? movie.vote_average : "Not rated"}
          </span>
        </div>
        <div className="date">
          <span className="subTitle">{movie.release_date}</span>
        </div>
      </div>
    </ContentModal>
  );
};

export default MovieCard;
