import React from "react";

const getImageSrc = (type) => {
  switch (type) {
    case "k":
      return "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg";
    case "K":
      return "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg";
    case "q":
      return "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg";
    case "Q":
      return "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg";
    case "r":
      return "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg";
    case "R":
      return "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg";
    case "b":
      return "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg";
    case "B":
      return "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg";
    case "n":
      return "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg";
    case "N":
      return "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg";
    case "p":
      return "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg";
    case "P":
      return "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg";
    default:
      return "https://upload.wikimedia.org/wikipedia/commons/archive/1/1d/20190803104324%21No_image.svg";
  }
};

const Square = ({ type, color, num }) => {
  return (
    <button
      className={`${
        color === "b" ? "bg-gray-600" : " bg-gray-300"
      } rounded-sm ${type !== "e" ? "hover:bg-violet-600" : ""}`}
    >
      <img src={getImageSrc(type)} className=" w-full h-full" alt={type}></img>
    </button>
  );
};

export default Square;
