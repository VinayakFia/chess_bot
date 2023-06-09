import ChessBoard from "./ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Bishop extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color, 3);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        let res: Move[] = [];
        const color = this.getColor();

        res = res.concat(this.validInDirection(-1, -1, board));
        res = res.concat(this.validInDirection(1, 1, board));
        res = res.concat(this.validInDirection(-1, 1, board));
        res = res.concat(this.validInDirection(1, -1, board));
        
        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "b";
        return "B";
    }

}