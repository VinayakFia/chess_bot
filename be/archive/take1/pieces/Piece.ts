import ChessBoard from "./ChessBoard";
import { Move, Position, Color } from "./Move";

export default abstract class Piece {

    private position: Position;
    private color: Color;
    private value: number;
    
    constructor(row: number, col: number, color: Color, value: number) {
        this.position = { row, col };
        this.color = color;
        this.value = value;
    }

    public abstract validMoves(board: ChessBoard): Move[];

    public abstract getFenChar(): string;

    protected isWhite(): boolean {
        return this.color === "w";
    }

    public getColor(): Color {
        return this.color;
    }

    public pos(): Position {
        return this.position;
    }

    protected posInRange(row: number, col: number): boolean {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    protected validInDirection(r: number, c: number, board: ChessBoard): Move[] {
        const pos = this.pos();
        const res: Move[] = [];
        const color = this.getColor();
        const enemy = color === "w" ? "b" : "w";

        for (let i = 1; i < 8; i++) {
            const row = pos.row + r * i;
            const col = pos.col + c * i;

            if (!this.posInRange(row, col)) break;

            if (this.posInRange(row, col) && board.colorOfSquare(row, col) !== color)
                res.push({ from: pos, to: { row: row, col: col }})

            const curCol = board.colorOfSquare(row, col);
            if (curCol === color || curCol === enemy) break;
        }

        return res;
    }

    public updatePos(row: number, col: number) {
        this.position.row = row;
        this.position.col = col;
    }

    public getValue() {
        if (this.color === "b") return -this.value;
        return this.value;
    }

}