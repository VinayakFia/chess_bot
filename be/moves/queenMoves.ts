import { Move } from "../ChessBot";
import { colOf, colorOf, inRange, posOf, rowOf, validMovesInDirection } from "./moveHelpers";

const queenMoves = (pieces: string[], pos: number): Move[] => {
    let res: Move[] = [];

    res = res.concat(validMovesInDirection(-1, -1, pieces, pos));
    res = res.concat(validMovesInDirection(1, 1, pieces, pos));
    res = res.concat(validMovesInDirection(-1, 1, pieces, pos));
    res = res.concat(validMovesInDirection(1, -1, pieces, pos));
    res = res.concat(validMovesInDirection(0, -1, pieces, pos));
    res = res.concat(validMovesInDirection(0, 1, pieces, pos));
    res = res.concat(validMovesInDirection(1, 0, pieces, pos));
    res = res.concat(validMovesInDirection(-1, 0, pieces, pos));

    return res;
}

export default queenMoves;