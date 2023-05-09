import React, { createContext, useCallback, useEffect, useState } from "react";
import Square from "./Square";
import { beURL } from "../../env";

const setupPieces = (fen) => {
  const pieces = [];
  const chars = [...fen];
  for (const c of chars) {
    if (c === "/") continue;
    else if (!isNaN(parseInt(c))) {
      const n = parseInt(c);
      for (let i = 0; i < n; i++) {
        pieces.push({ piece: "e", highlighted: false });
      }
    } else {
      pieces.push({ piece: c, highlighted: false });
    }
  }
  return pieces;
}

export const PiecesContext = createContext();

const Board = ({ fen }) => {
  const [pieces, setPieces] = useState(setupPieces(fen));
  const [moves, setMoves] = useState([]);

  const highlightMoves = (n) => {
    const np = pieces.map((p) => { p.highlighted = false; return p });

    let col = n % 8;
    let row = Math.ceil((n + 1) / 8) - 1;
    const validMoves = moves.filter((x) => x.from.row === row && x.from.col === col)

    for (const move of validMoves) {
      const id = move.to.row * 8 + move.to.col;
      np[id].highlighted = true;
    }

    setPieces(np);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${beURL}/validMoves?color=w`, { method: 'GET' })
        .then((res) => res.json())
        .then((res) => setMoves(res));
    }

    fetchData();
  }, []);

  return (
    <PiecesContext.Provider value={pieces}>
      <div className="grid grid-cols-8 h-1/2 rounded-md p-10 bg-slate-900">
        {pieces.map((c, i) => (
          <Square id={i} highlightMoves={highlightMoves} />
        ))}
      </div>
    </PiecesContext.Provider>
  );
};

export default Board;
