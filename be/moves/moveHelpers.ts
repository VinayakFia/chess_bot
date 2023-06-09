import { Color, Move } from "../ChessBot";

export const validMovesInDirection = (
    r: number, 
    c: number, 
    pieces: string[], 
    pos: number
): Move[] => {
    const res: Move[] = [];
    const color = colorOf(pieces[pos]);
    const enemy = color === "w" ? "b" : "w";
    const oRow = rowOf(pos);
    const oCol = colOf(pos);

    for (let i = 1; i < 8; i++) {
        const row = oRow + r * i;
        const col = oCol + c * i;

        if (!inRange(row, col)) break;

        if (pieces[posOf(row, col)] === "" || colorOf(pieces[posOf(row, col)]) !== color)
            res.push({ 
                from: pos, 
                to: posOf(row, col), 
                at: pieces[posOf(row, col)], 
                type: "move" 
            });

        if (pieces[posOf(row, col)] === "") continue;
        else break;
    }

    return res;
};

export const rowOf = (pos: number): number =>
    Math.floor(pos / 8);

export const colOf = (pos: number): number =>
    pos % 8;

export const posOf = (row: number, col: number): number =>
    row * 8 + col;

export const inRange = (row: number, col: number): boolean => 
    row >= 0 && row < 8 && col >= 0 && col < 8;

export const colorOf = (p: string): Color =>
    p.toUpperCase() === p ? "w" : "b";