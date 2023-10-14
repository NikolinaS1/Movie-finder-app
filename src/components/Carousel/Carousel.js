import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { img_300, noPicture } from "../../config/config";
import "./Carousel.css";

const handleDragStart = (e) => e.preventDefault();

const Carousel = ({ id }) => {
  const API_URL = "https://api.themoviedb.org/3/";
  const [credits, setCredits] = useState();

  const items = credits?.map((c) => (
    <div className="carouselItem" key={c.id}>
      <img
        src={c.profile_path ? `${img_300}/${c.profile_path}` : noPicture}
        alt={c?.name}
        onDragStart={handleDragStart}
        className="carouselItem_img"
      />
      <b className="carouselItem_txt">{c?.name}</b>
    </div>
  ));

  const responsive = {
    0: { items: 3 },
    512: { items: 5 },
    1024: { items: 7 },
  };

  const fetchCredits = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/${id}/credits`, {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
        },
      });

      console.log("fetchData data", data);
      setCredits(data.cast);
      console.log(data);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <AliceCarousel
      autoPlay
      responsive={responsive}
      infinite
      disableDotsControls
      disableButtonsControls
      mouseTracking
      items={items}
    />
  );
};

export default Carousel;
