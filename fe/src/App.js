import React, { useEffect } from "react";
import Board from "./components/board/Board";
import { beURL } from "./env";

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = fetch(`${beURL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    fetchData()
  }, []);


  return (
    <div className="h-screen w-screen bg-slate-700 flex justify-center items-center">
      <Board fen={fen} />
    </div>
  );
};

export default App;
