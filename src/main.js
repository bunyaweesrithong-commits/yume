import React from "react";
import ReactDOM from "react-dom/client";
import Gallery from "./pages/Gallery";
import "./style.css";

const galleryRoot = document.getElementById("gallery-root");

if (galleryRoot) {
  ReactDOM.createRoot(galleryRoot).render(
    React.createElement(Gallery)
  );
}