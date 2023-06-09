import { CastleRights, Move } from "../ChessBot";
import { colOf, colorOf, inRange, posOf, rowOf, validMovesInDirection } from "./moveHelpers";

const kingMoves = (
    pieces: string[], 
    pos: number, 
    whiteCastle: CastleRights, 
    blackCastle: CastleRights
): Move[] => {
    let res: Move[] = [];
    let color = colorOf(pieces[pos]);
    const row = rowOf(pos);
    const col = colOf(pos);

    for (let r = -1; r < 2; r++) {
        for (let c = -1; c < 2; c++) {
            if (inRange(row + r, col + c) &&
                (pieces[posOf(row + r, col + c)] === "" ||
                    colorOf(pieces[posOf(row + r, col + c)]) !== color))
                res.push({
                    from: pos,
                    to: posOf(row + r, col + c),
                    at: pieces[posOf(row + r, col + c)],
                    type: "move"
                });
        }
    }

    // castling 
    /*
    if (
        color === "w" && 
        whiteCastle.left && 
        pieces[59] === "" &&
        pieces[58] === "" &&
        pieces[57] === ""
    ) {
        res.push({ from: pos, to: 57, at: "", type: "w_l_castle" });    
    }
    */

    return res;
}

export default kingMoves;