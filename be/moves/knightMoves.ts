import { Move } from "../ChessBot";
import { colOf, colorOf, inRange, posOf, rowOf } from "./moveHelpers";

const knightMoves = (pieces: string[], pos: number): Move[] => {
    const res: Move[] = [];
    const p = pieces[pos];
    const color = colorOf(p);
    const row = rowOf(pos);
    const col = colOf(pos);

    let moves = [
        { row: row - 2, col: col + 1 },
        { row: row - 2, col: col - 1 },
        { row: row + 2, col: col + 1 },
        { row: row + 2, col: col - 1 },
        { row: row - 1, col: col + 2 },
        { row: row - 1, col: col - 2 },
        { row: row + 1, col: col + 2 },
        { row: row + 1, col: col - 2 },
    ];
    moves.forEach((move) => {
        if (
            inRange(move.row, move.col) &&
            (pieces[posOf(move.row, move.col)] === "" ||
                colorOf(pieces[posOf(move.row, move.col)]) !== color)
        ) {
            res.push({ 
                from: pos,
                to: posOf(move.row, move.col),
                at: pieces[posOf(move.row, move.col)],
                type: "move"
            });
        }
    });

    return res;
}

export default knightMoves;