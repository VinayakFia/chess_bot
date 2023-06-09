import bishopMoves from "./moves/bishopMoves";
import kingMoves from "./moves/kingMoves";
import knightMoves from "./moves/knightMoves";
import { colOf, colorOf, rowOf } from "./moves/moveHelpers";
import pawnMoves from "./moves/pawnMoves";
import queenMoves from "./moves/queenMoves";
import rookMoves from "./moves/rookMoves";

type MoveType = "move" | "w_l_castle";

const pieceValues: Map<string, number> = new Map([
    ["b", 3],
    ["n", 3],
    ["r", 5],
    ["q", 9],
    ["p", 1],
    ["k", 0],
    ["", 0]
]);

export interface CastleRights {
    left: boolean,
    right: boolean
};

export interface Move {
    from: number,
    to: number,
    at: string,
    type: MoveType
};

export type Color = "b" | "w";

export class ChessBot {

    private pieces: string[];
    private turn: Color;
    private whiteCastle: CastleRights;
    private blackCastle: CastleRights;

    public constructor(fen: string) {
        this.pieces = this.fromFen(fen);
        this.turn = "w";
        this.whiteCastle = { left: true, right: true };
        this.blackCastle = { left: true, right: true };
    }

    public copyBot(): ChessBot {
        const res = new ChessBot("");
        res.setState(this.pieces, this.turn);
        return res;
    }

    protected setState(pieces: string[], turn: Color): ChessBot {
        this.pieces = pieces;
        this.turn = turn;
        return this;
    }

    public executeMove(from: number, to: number) {
        const move = this.validMoves().filter((m) => m.from === from && m.to === to)[0];
        if (!move) throw new Error("Invalid Move");
        this.makeMove(move);
    }

    public bestMove(): Move {
        const start = performance.now();

        const depth = 2;
        const moves = this.validMoves();

        let bestMove: Move = moves[0];
        let bestEval = Number.NEGATIVE_INFINITY;

        for (const move of moves) {
            this.makeMove(move);
            const search = -this.search(
                depth, 
                Number.NEGATIVE_INFINITY, 
                Number.POSITIVE_INFINITY
            );
            if (bestEval < search) {
                bestMove = move;
                bestEval = search;
            }
            this.unmakeMove(move);
            console.log(search)
        }

        console.log(`BestMove took: ${(performance.now() - start) / 1000}`);

        if (bestMove) {
            console.log("Chose move " + bestMove.from + 
                " to " + bestMove.to + " capturing " + bestMove.at + 
                " with eval " + bestEval);
            return bestMove;
        }
            
        return { from: -1, to: -1, at: "", type: "move" };
    }

    public getPieces(): string[] {
        return this.pieces.map((x) => x === "" ? "e" : x);
    }

    public validMoves(): Move[] {
        return this.trimMoves(this.allMoves())
            .filter((move) => move.at.toLowerCase() !== "k");
    }

    private countPieces(): number {
        let res = 0;

        for (const p of this.pieces) {
            const val = this.valueOfPiece(p);
            res += colorOf(p) === this.turn ? val : -val;
        }

        return res;
    }

    private searchCaptures(alpha: number, beta: number): number {
        const evaluation = this.countPieces();
        if (evaluation >= beta)
            return beta;

        alpha = Math.max(alpha, evaluation);

        const captureMoves = this.validMoves().filter((move) => move.at !== "");

        for (const move of captureMoves) {
            this.makeMove(move);
            const evaluation = -this.searchCaptures(-beta, -alpha);
            this.unmakeMove(move);

            if (evaluation >= beta)
                return beta;
            alpha = Math.max(alpha, evaluation);
        }

        return alpha;
    }

    private search(depth: number, alpha: number, beta: number): number {
        if (depth === 0) {
            return this.searchCaptures(alpha, beta);
        }

        const moves = this.validMoves();
        if (moves.length === 0) {
            // ! Avoids draws at all costs
            this.changeTurn();
            if (this.canCaptureKing())
                return Number.NEGATIVE_INFINITY;
            this.changeTurn();
            return 0;
        }

        for (const move of moves) {
            this.makeMove(move);
            const evaluation = -this.search(depth - 1, -beta, -alpha);
            this.unmakeMove(move);
            if (evaluation >= beta) return beta;
            alpha = Math.max(alpha, evaluation);
        }

        return alpha;
    }

    private canCaptureKing(): boolean {
        const moves = this.allMoves();
        let kingPos;

        this.pieces.forEach((p, i) => {
            if (p.toLowerCase() === "k" && colorOf(p) !== this.turn)
                kingPos = i;
        });

        // ! This should never be reached
        if (!kingPos) return true;
        
        for (const move of moves) {
            if (move.to === kingPos)
                return true;
        }

        return false;
    }
    
    private trimMoves(moves: Move[]): Move[] {
        const newMoves: Move[] = [];

        for (const move of moves) {
            this.makeMove(move);
            if (!this.canCaptureKing())
                newMoves.push(move);
            this.unmakeMove(move);
        }

        return newMoves;
    }

    private valueOfPiece(p: string): number {
        p = p.toLowerCase();
        if (p === "") return 0;
        const val = pieceValues.get(p);
        if (val === undefined) throw new Error("Invalid Piece " + p);
        return val;
    }

    private orderMoves(moves: Move[]) {
        const valueDiff = (move: Move): number => {
            const to = this.valueOfPiece(this.pieces[move.to]);
            const from = this.valueOfPiece(this.pieces[move.from]);
            return to - from;
        }

        moves.sort((a, b) => valueDiff(b) - valueDiff(a));

        return moves;
    }

    private allMoves(): Move[] {
        let moves: Move[] = [];

        this.pieces.forEach((p, i) => {
            if (colorOf(p) !== this.turn) return;

            const c = p.toLowerCase();

            switch (c) {
                case "p":
                    moves = moves.concat(pawnMoves(this.pieces, i));
                    break;
                case "n":
                    moves = moves.concat(knightMoves(this.pieces, i));
                    break;
                case "q":
                    moves = moves.concat(queenMoves(this.pieces, i));
                    break;
                case "r":
                    moves = moves.concat(rookMoves(this.pieces, i));
                    break;
                case "b":
                    moves = moves.concat(bishopMoves(this.pieces, i));
                    break;
                case "k":
                    moves = moves.concat(kingMoves(
                        this.pieces, 
                        i, 
                        this.whiteCastle, 
                        this.blackCastle
                    ));
                    break;
                default:
                    break;
            }
        });

        return this.orderMoves(moves);
    }

    private fromFen(fen: string): string[] {
        const chars = [...fen];
        const pieces: string[] = [];

        for (const c of chars) {
            if (c === "/") continue;
            else if (isNaN(parseInt(c))) pieces.push(c);
            else {
                for (let i = 0; i < parseInt(c); i++) {
                    pieces.push("");
                }
            }
        }
        return pieces;
    }

    private makeMove(move: Move) {
        this.pieces[move.to] = this.pieces[move.from];
        this.pieces[move.from] = "";

        if (move.type === "w_l_castle") {
            this.pieces[move.to + 1] = "R";
            this.pieces[move.to - 1] = "";
        }

        this.changeTurn();
    }

    private unmakeMove(move: Move) {
        this.pieces[move.from] = this.pieces[move.to];
        this.pieces[move.to] = move.at;

        if (move.type === "w_l_castle") {
            this.pieces[move.to + 1] = "";
            this.pieces[move.to - 1] = "R";
        }

        this.changeTurn();
    }

    private changeTurn() {
        this.turn = this.turn === "w" ? "b" : "w";
    }

}