import ChessBoard from "../ChessBoard";
import { Move, Position, Color } from "./Move";

export default abstract class Piece {

    private position: Position;
    private color: Color;
    
    constructor(row: number, col: number, color: Color) {
        this.position = { row, col };
        this.color = color;
    }

    public abstract validMoves(board: ChessBoard): Move[];

    public abstract getFenChar(): string;

    protected isWhite(): boolean {
        return this.color === "w";
    }

    public getColor(): Color {
        return this.color;
    }

    protected pos(): Position {
        return this.position;
    }

    protected posInRange(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

}