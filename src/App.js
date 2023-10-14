import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { Container } from "@mui/material";
import Trending from "./pages/Trending/Trending";
import TopRated from "./pages/TopRated/TopRated";
import Search from "./pages/Search/Search";
import Genres from "./pages/Genres/Genres";
import Login from "./pages/Autentification/Login";
import Account from "./pages/Account/Account";

function App() {
  return (
    <Router>
      {window.location.pathname !== "/login" && <Header />}
      <div className="app">
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Trending />} exact />
            <Route path="/toprated" element={<TopRated />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/search" element={<Search />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
