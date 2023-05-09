import React, { useEffect, useState } from "react";
import Board from "./components/board/Board";
import { beURL } from "./env";

const fen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R";

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = fetch(`${beURL}/create`, {
        method: 'POST',
        body: JSON.stringify({ fen: fen }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    fetchData()
  }, []);


  return (
    <div className="h-screen w-screen bg-slate-700 flex justify-center items-center">
      <Board fen={"rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R"} />
    </div>
  );
};

export default App;
