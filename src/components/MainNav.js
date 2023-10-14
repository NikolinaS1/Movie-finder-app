import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";
import MovieIcon from "@mui/icons-material/Movie";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function SimpleBottomNavigation({ isLoggedIn }) {
  const [value, setValue] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (value) {
      navigate(value);
    }
  }, [value, navigate]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        zIndex: 100,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Trending" icon={<WhatshotIcon />} value="/" />
        <BottomNavigationAction label="Top rated" icon={<StarIcon />} value="/toprated" />
        <BottomNavigationAction label="Movies by genres" icon={<MovieIcon />} value="/genres" />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} value="/search" />
        {isLoggedIn && (
          <BottomNavigationAction
            label="Account"
            icon={<AccountCircleIcon />}
            value="/account"
          />
        )}
      </BottomNavigation>
    </Box>
  );
}
