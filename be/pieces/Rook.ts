import ChessBoard from "../ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Rook extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        return [];
    }

    public getFenChar(): string {
        if (this.isWhite()) return "r";
        return "R";
    }

}