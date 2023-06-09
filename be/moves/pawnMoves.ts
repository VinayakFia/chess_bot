import { Move } from "../ChessBot";
import { colOf, colorOf, inRange, posOf, rowOf } from "./moveHelpers";

const pawnMoves = (pieces: string[], pos: number): Move[] => {
    const res: Move[] = [];
    const p = pieces[pos];
    const direction = colorOf(p) === "w" ? -1 : 1;
    const enemy = direction === -1 ?  "b" : "w";
    const row = rowOf(pos);
    const col = colOf(pos);

    if (inRange(row + direction, col - 1) 
        && pieces[posOf(row + direction, col - 1)] !== ""
        && colorOf(pieces[posOf(row + direction, col - 1)]) === enemy)
        res.push({ 
            from: posOf(row, col),
            to: posOf(row + direction, col - 1),
            at: pieces[posOf(row + direction, col - 1)],
            type: "move"
        });

    if (inRange(row + direction, col + 1) 
        && pieces[posOf(row + direction, col + 1)] !== ""
        && colorOf(pieces[posOf(row + direction, col + 1)]) === enemy)
        res.push({ 
            from: posOf(row, col),
            to: posOf(row + direction, col + 1),
            at: pieces[posOf(row + direction, col + 1)],
            type: "move"
        });

    if (inRange(row + direction, col) 
        && pieces[posOf(row + direction, col)] === "")
        res.push({ 
            from: posOf(row, col),
            to: posOf(row + direction, col),
            at: pieces[posOf(row + direction, col)],
            type: "move"
        });

    if (direction === -1 && row === 6 
        && pieces[posOf(row + direction, col)] === ""
        && pieces[posOf(row + direction * 2, col)] === "")
        res.push({
            from: posOf(row, col),
            to: posOf(row + direction * 2, col),
            at: pieces[posOf(row + direction * 2, col)],
            type: "move"
        })

    if (direction === 1 && row === 1 
        && pieces[posOf(row + direction, col)] === ""
        && pieces[posOf(row + direction * 2, col)] === "")
        res.push({
            from: posOf(row, col),
            to: posOf(row + direction * 2, col),
            at: pieces[posOf(row + direction * 2, col)],
            type: "move"
        })

    return res;
}

export default pawnMoves;