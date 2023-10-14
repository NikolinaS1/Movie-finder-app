import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../../components/MovieCard/MovieCard";
import CustomPagination from "../../components/Pagination/CustomPagination";
import Button from "@mui/material/Button";
import "./Search.css";

const Search = () => {
  const API_URL = "https://api.themoviedb.org/3/";
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [movies, setMovies] = useState([]);
  const [numOfPages, setNumOfPages] = useState(0);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsButtonClicked(false);
  }, [searchText]);

  const fetchSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/search/movie`, {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          query: searchText,
          page: page,
        },
      });

      let results = response.data.results;
      const token = localStorage.getItem("movie-app-token");

      if (token) {
        const userResponse = await axios.get(
          `http://localhost:5000/api/get-user-by-token`,
          {
            headers: { token: token },
          }
        );

        if (userResponse.data) {
          const favorites = userResponse.data.favorites || "";
          results.forEach(function (item) {
            item.isFavorite = favorites.split(",").includes(item.id.toString());
          });
        }
      }

      setMovies(results);
      setNumOfPages(response.data.total_pages);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching movies:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (isButtonClicked) {
      fetchSearch();
    }
  }, [page, isButtonClicked]);

  const handleSearchClick = () => {
    setIsButtonClicked(true); // Set the flag to true on button click
  };

  const renderMovies = () => {
    return movies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
  };

  console.log(movies.length);

  return (
    <div>
      <div style={{ display: "flex", margin: "15px 0" }}>
        <TextField
          style={{ flex: 1 }}
          className="searchBox"
          label="Search"
          variant="filled"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ marginLeft: 10 }}
          onClick={handleSearchClick}
        >
          <SearchIcon />
        </Button>
      </div>
      <div className="container">
        {!isLoading && movies.length === 0 && isButtonClicked ? ( // Show message only when there are no results and the button is clicked
          <h2 className="message">Movies not found!</h2>
        ) : (
          renderMovies()
        )}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numberOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Search;
