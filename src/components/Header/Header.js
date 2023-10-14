import "./Header.css";
import { useState } from "react";
import LogoutButton from "../LogoutButton/LogoutButton";
import SimpleBottomNavigation from "../MainNav";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("movie-app-token")
  );

  const handleLogin = (token) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.href = "./";
  };

  return (
    <div className="header">
      <span onClick={() => window.scroll(0, 0)} className="headerTitle">
        Movie finder
      </span>

      {isLoggedIn ? (
        <div>
          <LogoutButton onLogout={handleLogout} />
        </div>
      ) : (
        <a href="/login">
          <button onSubmit={handleLogin} className="login-btn">
            Login
          </button>
        </a>
      )}

      <SimpleBottomNavigation isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Header;
