import ChessBoard from "../ChessBoard";
import { Color, Move } from "./Move";
import Piece from "./Piece";

export default class Queen extends Piece {
    
    constructor(row: number, col: number, color: Color) {
        super(row, col, color);
    }
    
    public validMoves(board: ChessBoard): Move[] {
        const res: Move[] = [];
        const pos = this.pos();
        const color = this.getColor();
        const enemy = color === "w" ? "b" : "w";

        // this -> top left
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row - i, pos.col - i);
            if (this.posInRange(pos.row - i, pos.col - i) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row - i, col: pos.col - i }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        // this -> bot right
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row + i, pos.col + i);
            if (this.posInRange(pos.row + i, pos.col + i) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row + i, col: pos.col + i }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        // this -> top right
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row - i, pos.col + i);
            if (this.posInRange(pos.row - i, pos.col + i) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row - i, col: pos.col + i }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        // this -> bot left
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row + i, pos.col - i);
            if (this.posInRange(pos.row + i, pos.col - i) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row + i, col: pos.col - i }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        // this -> left
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row, pos.col - i);
            if (this.posInRange(pos.row, pos.col - i) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row, col: pos.col - i }})
            if (curCol === color || curCol === enemy) 
                break;
        }


        // this -> right
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row, pos.col + i);
            if (this.posInRange(pos.row, pos.col + i) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row, col: pos.col + i }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        // this -> top
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row - i, pos.col);
            if (this.posInRange(pos.row - i, pos.col) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row - i, col: pos.col }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        // this -> bottom
        for (let i = 0; i < 8; i++) {
            const curCol = board.colorOfSquare(pos.row + i, pos.col);
            if (this.posInRange(pos.row + i, pos.col) && curCol !== color)
                res.push({ from: pos, to: { row: pos.row + i, col: pos.col }})
            if (curCol === color || curCol === enemy) 
                break;
        }

        return res;
    }

    public getFenChar(): string {
        if (this.isWhite()) return "q";
        return "Q";
    }

}