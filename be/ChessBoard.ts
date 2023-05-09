import Bishop from "./pieces/Bishop";
import Empty from "./pieces/Empty";
import King from "./pieces/King";
import Knight from "./pieces/Knight";
import { Color, Move } from "./pieces/Move";
import Pawn from "./pieces/Pawn";
import Piece from "./pieces/Piece";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

export default class ChessBoard {

    private pieces: Piece[][];

    private constructor(pieces: Piece[][]) {
        this.pieces = pieces;
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
        console.log(row, col);
        return this.pieces[row][col].getColor();
    }

    // not implemented, trims moves that lets the opponent capture the king
    private trimMoves(moves: Move[]): Move[] {
        return moves;
    }

    public validMoves(color: string): Move[] {
        if (color !== "w" && color !== "b") throw new Error("validMoves invalid color");

        const res: Move[] = [];
        for (const row of this.pieces) {
            for (const piece of row) {
                if (piece.getColor() === color) continue;
                piece.validMoves(this).forEach((m) => res.push(m));
            }
        }
        return this.trimMoves(res);
    }

}