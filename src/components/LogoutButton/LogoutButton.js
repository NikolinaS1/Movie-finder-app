import React from "react";

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("movie-app-token");
    onLogout();
  };

  return (
    <button className="login-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
