import ChessBoard from "../ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Knight extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        const res: Move[] = [];
        const pos = this.pos();
        const color = this.getColor();

        let moves = [
            { row: pos.row - 2, col: pos.col + 1 },
            { row: pos.row - 2, col: pos.col - 1 },
            { row: pos.row + 2, col: pos.col + 1 },
            { row: pos.row + 2, col: pos.col - 1 },
            { row: pos.row - 1, col: pos.col + 2 },
            { row: pos.row - 1, col: pos.col - 2 },
            { row: pos.row + 1, col: pos.col + 2 },
            { row: pos.row + 1, col: pos.col - 2 },
        ];
        for (const move of moves) {
            if (this.posInRange(move.row, move.col) && board.colorOfSquare(move.row, move.col) !== color) {
                res.push({ from: pos, to: move });
            }
        }

        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "n";
        return "N";
    }

}