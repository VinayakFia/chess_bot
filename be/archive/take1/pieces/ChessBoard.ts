import Bishop from "./Bishop";
import Empty from "./Empty";
import King from "./King";
import Knight from "./Knight";
import { Color, Move } from "./Move";
import Pawn from "./Pawn";
import Piece from "./Piece";
import Queen from "./Queen";
import Rook from "./Rook";

export default class ChessBoard {

    private pieces: Piece[][];
    private turn: Color;

    private constructor(pieces: Piece[][]) {
        this.pieces = pieces;
        this.turn = "w";
    }

    public static fromFen(fen: string): ChessBoard {
        const pieces: Piece[][] = [];
        pieces.push([]);

        let row = 0;
        let col = 0;
        
        const chars = [...fen];

        for (const c of chars) {
            // empty squares
            if (!isNaN(parseInt(c))) {
                const n = parseInt(c);
                for (let i = 0; i < n; i++) {
                    if (col >= 8) 
                        throw new Error(`Invalid Fen string ${fen}.`);
                    pieces[row].push(new Empty(row, col));
                    col++;
                }
            } else if (c === "/") {
                if (col != 8)
                    throw new Error(`Invalid fen string, row ${row+1} not full.`);
                pieces.push([]);
                col = 0;
                row++;  
            } else {
                if (c.toLowerCase() === "r") {
                    pieces[row].push(new Rook(row, col, this.getColor(c)));
                } else if (c.toLowerCase() === "n") {
                    pieces[row].push(new Knight(row, col, this.getColor(c)));
                } else if (c.toLowerCase() === "b") {
                    pieces[row].push(new Bishop(row, col, this.getColor(c)));
                } else if (c.toLowerCase() === "q") {
                    pieces[row].push(new Queen(row, col, this.getColor(c)));
                } else if (c.toLowerCase() === "k") {
                    pieces[row].push(new King(row, col, this.getColor(c)));
                } else if (c.toLowerCase() === "p") {
                    pieces[row].push(new Pawn(row, col, this.getColor(c)));
                }
                col++;
            }
        }
        return new ChessBoard(pieces);
    }

    private static getColor(c: string): Color {
        if (c.toLowerCase() !== c) return "w";
        return "b";
    }

    public getFen(): string {
        let res = "";
        for (const row of this.pieces) {
            let e = 0;
            for (const p of row) {
                if (p instanceof Empty) {
                    e += 1;
                } else {
                    if (e != 0) res += e.toString();
                    res += p.getFenChar();
                    e = 0;
                }
            }
            if (e != 0) res += e.toString();
            res += "/";
        }
        return res.slice(0, -1);
    }

    public colorOfSquare(row: number, col: number): Color {
        return this.pieces[row][col].getColor();
    }

    private playerInCheck(): boolean {
        const enemy = this.turn === "b" ? "w" : "b";
        const moves = this.getMoves(this.turn);
        const enemyKing = this.pieces.flat()
            .filter((p) => p instanceof King && p.getColor() === enemy)[0];

        if (!enemyKing) throw new Error("!NO KING :((((");

        for (const m of moves) {
            if (m.to === enemyKing.pos()) return true;
        }

        return false;
    }

    // trims moves that lets the opponent capture the king
    private trimMoves(moves: Move[]): Move[] {
        const res: Move[] = [];
        for (const move of moves) {
            this.makeMove(move);
            if (!this.playerInCheck())
                res.push(move);
            this.unmakeMove(move);
        }
        console.log(this.pieces)
        return res;
    }

    public validMoves(color: string): Move[] {
        this.trimMoves(this.getMoves(color));
        return this.getMoves(color);
    }

    private getMoves(color: string): Move[] {
        if (color !== "w" && color !== "b") throw new Error("validMoves invalid color");
        this.turn = color;

        let res: Move[] = [];
        for (const row of this.pieces) {
            for (const piece of row) {
                if (piece.getColor() !== color) continue;
                res = res.concat(piece.validMoves(this));
            }
        }

        for (const move of res) {
            move.toPiece = this.pieces[move.to.row][move.to.col];
        }

        this.turn = this.turn === "w" ? "b" : "w";

        return res;
    }

    private updateTurn(curMove: Color) {
        this.turn = curMove === "w" ? "b" : "w";
    }

    public makeMove(move: Move) {
        const frRow = move.from.row;
        const frCol = move.from.col;
        const toRow = move.to.row;
        const toCol = move.to.col;

        const from = this.pieces[frRow][frCol];

        this.updateTurn(this.turn);
        this.pieces[toRow][toCol] = from;
        this.pieces[toRow][toCol].updatePos(toRow, toCol);
        this.pieces[frRow][frCol] = new Empty(frRow, frCol);
    }

    public unmakeMove(move: Move) {
        if (!move.toPiece) throw new Error("Invalid call to unmakeMove");

        console.log(move.toPiece);
        console.log(this.pieces);

        const to = this.pieces[move.to.row][move.to.col];

        this.updateTurn(this.turn);
        this.pieces[move.from.row][move.from.col] = to;
        this.pieces[move.from.row][move.from.col].updatePos(move.from.row, move.from.col);
        this.pieces[move.to.row][move.to.col] = move.toPiece;
        this.pieces[move.to.row][move.to.col].updatePos(move.to.row, move.to.col);
    }

    public evaluate() {
        let res = 0;
        const board = this.pieces;
        for (const row of board) {
            for (const p of row) {
                res += p.getValue();
            }
        }
        return res;
    }

    private search(depth: number, alpha: number, beta: number): number {
        if (depth == 0) return this.evaluate();
        
        const moves = this.validMoves(this.turn);
        if (moves.length === 0) {
            if (this.playerInCheck()) {
                return Number.NEGATIVE_INFINITY;
            }
            return 0;
        }

        for (const move of moves) {
            this.makeMove(move);
            const evaluation = -this.search(depth - 1, -beta, -alpha);
            this.unmakeMove(move);
            if (evaluation >= beta) {
                return beta;
            }
            alpha = Math.max(alpha, evaluation);
        }

        return alpha
    }

    public getTurn(): Color {
        return this.turn;
    }

}