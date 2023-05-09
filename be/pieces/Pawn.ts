import ChessBoard from "../ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Pawn extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        const res: Move[] = [];
        const pos = this.pos();
        if (this.isWhite()) {
            if (this.posInRange(pos.row - 1, pos.col - 1) 
                && board.colorOfSquare(pos.row - 1, pos.col - 1) === "b")
                res.push({ 
                    from: pos, 
                    to: { row: pos.row - 1, col: pos.col - 1 } 
                });
            if (this.posInRange(pos.row - 1, pos.col + 1) 
                && board.colorOfSquare(pos.row - 1, pos.col + 1) === "b")
                res.push({ 
                    from: pos, 
                    to: { row: pos.row - 1, col: pos.col + 1 } 
                });
            if (this.posInRange(pos.row - 1, pos.col) 
                && board.colorOfSquare(pos.row - 1, pos.col) === "e")
                res.push({ 
                    from: pos, 
                    to: { row: pos.row - 1, col: pos.col } 
                });
            if (pos.row === 6 
                && board.colorOfSquare(pos.row - 1, pos.col) === "e" 
                && board.colorOfSquare(pos.row - 2, pos.col) === "e")
                res.push({
                    from: pos,
                    to: { row: pos.row - 2, col: pos.col }
                })
        } else {
            if (this.posInRange(pos.row + 1, pos.col - 1) 
                && board.colorOfSquare(pos.row + 1, pos.col - 1) === "b")
                res.push({ 
                    from: pos, 
                    to: { row: pos.row + 1, col: pos.col - 1 } 
                });
            if (this.posInRange(pos.row + 1, pos.col + 1) 
                && board.colorOfSquare(pos.row + 1, pos.col + 1) === "b")
                res.push({ 
                    from: pos, 
                    to: { row: pos.row + 1, col: pos.col + 1 } 
                });
            if (this.posInRange(pos.row + 1, pos.col) 
                && board.colorOfSquare(pos.row + 1, pos.col) === "e")
                res.push({ 
                    from: pos, 
                    to: { row: pos.row + 1, col: pos.col } 
                });
            if (pos.row === 1
                && board.colorOfSquare(pos.row + 1, pos.col) === "e" 
                && board.colorOfSquare(pos.row + 2, pos.col) === "e")
                res.push({
                    from: pos,
                    to: { row: pos.row + 2, col: pos.col }
                })
        }
        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "p";
        return "P";
    }

}