import * as React from "react";
import { red } from "@mui/material/colors";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Carousel from "../Carousel/Carousel";
import axios from "axios";
import { useEffect, useState } from "react";
import "./ContentModal.css";
import {
  img_500,
  unavailable,
  unavailableLandscape,
} from "../../config/config";
import { Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "80%",
  bgcolor: "background.paper",
  borderRadius: 10,
  border: "1px solid #fff",
  boxShadow: 24,
  p: 4,
};

export default function ContentModal({
  children,
  id,
  isLoggedIn,
  onFavoriteChange,
  isFavorite,
  onClose
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = async () => {
    setOpen(false);

    if (typeof onClose === 'function') {
      await onClose();
    }
  };

  const API_URL = "https://api.themoviedb.org/3/";
  const [movies, setMovies] = useState();
  const [video, setVideo] = useState();

  // const buttonText = isFavorite
  //   ? "Movie is added to your favorites"
  //   : "Add movie to favorites";

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/${id}`, {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
        },
      });

      setMovies(data);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  const fetchVideo = async () => {
    try {
      const {
        data: { results },
      } = await axios.get(`${API_URL}/movie/${id}/videos`, {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
        },
      });

      setVideo(results[0]?.key);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchVideo();
  }, [id]);

  return (
    <>
      <div onClick={handleOpen} className="media">
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {movies && (
              <div className="ContentModal">
                {isLoggedIn && (
                  <div className="heartIcon">
                    <FavoriteIcon
                      className={`favorite-icon ${
                        isFavorite ? "favorite" : ""
                      }`}
                      style={{ color: isFavorite ? red[500] : "black" }}
                      onClick={onFavoriteChange}
                    />
                    <span className="add-favorite-text">
                      {isFavorite
                        ? "Movie is added to your favorites"
                        : "Add movie to favorites"}
                    </span>
                  </div>
                )}
                <img
                  alt={movies.title}
                  className="ContentModal_portrait"
                  src={
                    movies.poster_path
                      ? `${img_500}/${movies.poster_path}`
                      : unavailable
                  }
                />
                <img
                  alt={movies.title}
                  className="ContentModal_landscape"
                  src={
                    movies.backdrop_path
                      ? `${img_500}/${movies.backdrop_path}`
                      : unavailableLandscape
                  }
                />
                <div className="ContentModal_about">
                  <span className="ContentModal_title">
                    {movies.title} (
                    {(movies.release_date || "----").substring(0, 4)})
                  </span>
                  {movies.tagline && (
                    <i className="tagline">
                      {movies.tagline
                        ? movies.tagline
                        : "No tagline available!"}
                    </i>
                  )}
                  <span className="ContentModal_description">
                    {movies.overview
                      ? movies.overview
                      : "No description available!"}
                  </span>
                  <div>
                    <Carousel id={id} />
                  </div>
                  <Button
                    className="button custom-button"
                    variant="contained"
                    startIcon={<YouTubeIcon />}
                    color="primary"
                    target="_blank"
                    href={`http://www.youtube.com/watch?v=${video}`}
                  >
                    Watch the Trailer
                  </Button>
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
