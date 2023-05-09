import ChessBoard from "./ChessBoard";

const cb = ChessBoard.fromFen("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R");
console.log(cb.getFen());
