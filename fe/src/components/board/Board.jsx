import React, { useEffect, useState } from "react";
import Square from "./Square";

const setupPieces = (fen) => {
  const pieces = [];
  const chars = [...fen];
  for (const c of chars) {
    if (c === "/") continue;
    else if (!isNaN(parseInt(c))) {
      const n = parseInt(c);
      for (let i = 0; i < n; i++) {
        pieces.push("e");
      }
    } else {
      pieces.push(c);
    }
  }
  return pieces;
}

const Board = ({ fen }) => {
  const [pieces, setPieces] = useState(setupPieces(fen));

  return (
    <div className="grid grid-cols-8 h-1/2 rounded-md p-10 bg-slate-900">
      {pieces.map((c, i) => (
        <Square key={i} type={c} num={i} color={(Math.floor(i / 8) + i) % 2 === 0 ? "w" : "b"} />
      ))}
    </div>
  );
};

export default Board;
