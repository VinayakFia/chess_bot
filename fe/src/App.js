import React, { useEffect } from "react";
import Board from "./components/board/Board";

const App = () => {
  return (
    <div className="h-screen w-screen bg-slate-700 flex justify-center items-center">
      <Board fen={"rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R"} />
    </div>
  );
};

export default App;
