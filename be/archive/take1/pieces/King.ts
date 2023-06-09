import ChessBoard from "./ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class King extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color, 99);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        let res: Move[] = [];
        const pos = this.pos();
        const color = this.getColor();

        for (let r = -1; r < 2; r++) {
            for (let c = -1; c < 2; c++) {
                if (r === c || !this.posInRange(pos.row + r, pos.col + c)) continue;
                if (board.colorOfSquare(pos.row + r, pos.col + c) !== color)
                    res.push() 
            }
        }
        
        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "k";
        return "K";
    }

}