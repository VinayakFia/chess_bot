import ChessBoard from "./ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Pawn extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color, 1);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        const res: Move[] = [];
        const pos = this.pos();
        const direction = this.isWhite() ? -1 : 1;
        const enemy = this.getColor() === "w" ? "b" : "w";

        if (this.posInRange(pos.row + direction, pos.col - 1) 
            && board.colorOfSquare(pos.row + direction , pos.col - 1) === enemy)
            res.push({ 
                from: pos, 
                to: { row: pos.row + direction, col: pos.col - 1 } 
            });
        if (this.posInRange(pos.row + direction, pos.col + 1) 
            && board.colorOfSquare(pos.row + direction , pos.col + 1) === enemy)
            res.push({ 
                from: pos, 
                to: { row: pos.row + direction, col: pos.col + 1 } 
            });
        if (this.posInRange(pos.row + direction, pos.col) 
            && board.colorOfSquare(pos.row + direction , pos.col) === "e")
            res.push({ 
                from: pos, 
                to: { row: pos.row + direction, col: pos.col } 
            });
        if (this.getColor() === "w" && pos.row === 6 
            && board.colorOfSquare(pos.row + direction, pos.col) === "e" 
            && board.colorOfSquare(pos.row + direction * 2, pos.col) === "e")
            res.push({
                from: pos,
                to: { row: pos.row + direction * 2, col: pos.col }
            })
        if (this.getColor() === "b" && pos.row === 1 
            && board.colorOfSquare(pos.row + direction, pos.col) === "e" 
            && board.colorOfSquare(pos.row + direction * 2, pos.col) === "e")
            res.push({
                from: pos,
                to: { row: pos.row + direction * 2, col: pos.col }
            })

        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "p";
        return "P";
    }

}