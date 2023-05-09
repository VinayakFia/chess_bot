export interface Position {
    row: number;
    col: number;
}

export type Color = "b" | "w" | "e";

export interface Move {
    from: Position;
    to: Position;
}