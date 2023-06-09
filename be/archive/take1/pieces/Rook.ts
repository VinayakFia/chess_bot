import ChessBoard from "./ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Rook extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color, 5);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        let res: Move[] = [];
        const pos = this.pos();
        const color = this.getColor();
        const enemy = color === "w" ? "b" : "w";

        res = res.concat(this.validInDirection(0, -1, board));
        res = res.concat(this.validInDirection(0, 1, board));
        res = res.concat(this.validInDirection(1, 0, board));
        res = res.concat(this.validInDirection(-1, 0, board));
        
        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "r";
        return "R";
    }

}