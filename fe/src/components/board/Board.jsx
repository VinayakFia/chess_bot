import React, { createContext, useEffect, useState } from "react";
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
};

export const PiecesContext = createContext();

const Board = ({ fen }) => {
  const [pieces, setPieces] = useState(setupPieces(fen));
  const [moves, setMoves] = useState([]);
  const [turn, setTurn] = useState("w");
  const [selected, setSelected] = useState({ row: -1, col: -1 });
  const [bestMove, setBestMove] = useState({ from: -1, to: -1 });

  const highlightMoves = (i) => {
    const np = pieces.map((p) => {
      p.highlighted = false;
      return p;
    });

    const validMoves = moves.filter((x) => x.from === i);

    for (const move of validMoves) {
      np[move.to].highlighted = true;
    }

    setPieces(np);
    setSelected(i);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${beURL}/validMoves`, { method: "GET" })
        .then((res) => res.json())
        .then((res) => setMoves(res));
    };

    fetchData();
  }, [turn]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${beURL}/bestMove`, { method: "GET" })
        .then((res) => res.json())
        .then((res) => setBestMove(res));
    };

    fetchData();
  }, [turn]);

  return (
    <PiecesContext.Provider
      value={{ pieces, setPieces, turn, setTurn, selected, bestMove }}
    >
      <div className="grid grid-cols-8 h-1/2 rounded-md p-10 bg-slate-900 m-auto">
        {pieces.map((c, i) => (
          <Square key={i} id={i} highlightMoves={highlightMoves} />
        ))}
      </div>
    </PiecesContext.Provider>
  );
};

export default Board;
