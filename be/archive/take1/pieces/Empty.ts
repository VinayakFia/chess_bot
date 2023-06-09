import ChessBoard from "./ChessBoard";
import { Move } from "./Move";
import Piece from "./Piece";

export default class Empty extends Piece {
    
    constructor(row: number, col: number) {
        super(row, col, "e", 0);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        return [];
    }

    public getFenChar(): string {
        return "e";
    }

}