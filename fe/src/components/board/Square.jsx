import React, { useContext, useEffect, useState } from "react";
import { PiecesContext } from "./Board";
import { beURL } from "../../env";

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

const Square = ({ id, highlightMoves }) => {
  const color = (Math.floor(id / 8) + id) % 2 === 0 ? "w" : "b";
  const { pieces, setPieces, selected, setTurn, bestMove } =
    useContext(PiecesContext);
  const type = pieces[id].piece;

  const [highlighted, sethighlighted] = useState(false);

  useEffect(() => {
    sethighlighted(pieces[id].highlighted);
  }, [id, pieces]);

  const makeMove = async (i) => {
    if (!highlighted) return;

    let res = await fetch(`${beURL}/move?fr=${selected}&to=${i}`, {
      method: "POST",
    });

    if (res.status !== 200) {
      console.error("Error making move");
      return;
    }

    res = await fetch(`${beURL}/getPieces`, { method: "GET" });
    res = await res.json();

    setPieces(
      res.map((x) => {
        return { piece: x, highlighted: false };
      })
    );
    setTurn((old) => (old === "w" ? "b" : "w"));
  };

  const squareClick = (id) => {
    highlightMoves(id);
    makeMove(id);
  };

  return (
    <button
      className={`rounded-sm ${type !== "e" ? "hover:bg-violet-600" : ""} 
        ${selected === id ? "bg-violet-500" : ""}
        ${
          highlighted
            ? color === "b"
              ? " bg-blue-500"
              : " bg-blue-300"
            : id === bestMove.from || id === bestMove.to
            ? color === "b"
              ? "bg-pink-500"
              : "bg-pink-300"
            : color === "b"
            ? "bg-gray-600"
            : "bg-gray-300"
        }`}
      onClick={() => squareClick(id)}
    >
      <img src={getImageSrc(type)} className=" w-full h-full" alt={type}></img>
    </button>
  );
};

export default Square;
