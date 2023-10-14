import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function (props) {
  let [authMode, setAuthMode] = useState("signin");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form onSubmit={handleLoginSubmit} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form-control"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="form-control"
                placeholder="Enter password"
                required
              />
            </div>
            {errMsg && <p className="error"> {errMsg} </p>}
            <div className="button">
              <button type="submit" className="submit">
                Submit
              </button>
            </div>
            <div className="text">
              Not registered yet?{" "}
              <span className="registration" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // logout
  // localStorage.setItem("movie-app-token", '');

  // favorite
  // const token = localStorage.getItem("movie-app-token");

  async function handleLoginSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);
      const token = response.data.token;
      localStorage.setItem("movie-app-token", token);
      localStorage.setItem("movie-app-user", JSON.stringify(response.data));
      window.location.href = "./";
    } catch (e) {
      console.log("Login error:", e);
      if (e.response?.status === 401) {
        setErrMsg("Wrong email or password.");
      }
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", {
        firstName,
        lastName,
        email,
        password,
      });

      console.log("Success:", response.data.message);
      // Redirect to login page when registration is successful
      if (response.data.message === "Registration successful") {
        window.location.href = "./login";
      }
    } catch (e) {
      console.log("Registration error:", e);
      if (e.response?.status === 409) {
        setErrMessage("User with this email already exists.");
      }
    }
  }

  return (
    <div className="Auth-form-container">
      <form onSubmit={handleRegisterSubmit} className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="form-control"
              placeholder="First name"
              required
            />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="form-control"
              placeholder="Last name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="form-control"
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          {errMessage && <p className="error"> {errMessage} </p>}
          <div className="button">
            <button type="submit" className="submit">
              Submit
            </button>
          </div>
          <div className="text">
            Already registered?{" "}
            <span className="registration" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
