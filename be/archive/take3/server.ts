import express from "express";
import Chess from "chess";
import cors from "cors";

// express
const app = express();
app.use(express.json());
const port = 8000;
app.use(cors());

// globals
type Turn = "white" | "black";
let client: Chess.AlgebraicGameClient;
let turn: Turn;

// api
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create", (req, res) => {
  console.log("/create");
  client = Chess.create({ PGN: true });
  turn = "white";
  res.status(200).send("Success");
});

app.get("/validMoves", (req, res) => {
  console.log("/validMoves");

  if (!client) {
    res.status(400).send("Error: call /create, board not initialised");
  } else {
    try {
      res.status(200).send(JSON.stringify(validMoves()));
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
});

app.post("/move", (req, res) => {
  let fr = req.query.fr as string;
  let to = req.query.to as string;

  console.log("/move");

  if (!fr || !to) {
    res.status(400).send("Error: provide valid from and to positions");
  } else if (!client) {
    res.status(400).send("Error: call /create, board not initialised");
  } else {
    try {
      makeMove(parseInt(fr), parseInt(to));
      res.status(200).send("Successy");
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
});

app.get("/bestMove", (req, res) => {
  console.log("/bestMove");

  if (!client) {
    res.status(400).send("Error: call /create, board not initialised");
  } else {
    try {
      res.status(200).send(JSON.stringify(bestMove()));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
});

app.get("/getPieces", (req, res) => {
  console.log("/getPieces");

  if (!client) {
    res.status(400).send("Error: call /create, board not initialised");
  } else {
    try {
      res.status(200).send(JSON.stringify(getPieces()));
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
});

app.listen(port, () => {
  console.log(`Chess app listening on port ${port}`);
});

// interfaces -----------------------------------------------------------------

interface Move {
  from: number;
  to: number;
}

// api functions --------------------------------------------------------------

const createGame = () => {
  client = Chess.create();
};

const validMoves = (): Move[] => {
  const moves: Move[] = [];

  client.validMoves.forEach((move) => {
    move.squares.forEach((square) => {
      moves.push({
        from: toPos(move.src.rank, move.src.file),
        to: toPos(square.rank, square.file),
      });
    });
  });

  return moves;
};

const makeMove = (from: number, to: number) => {
  console.log(toFile(from), toRank(from), toFile(to), toRank(to));

  const move = Object.entries(client.notatedMoves).filter((rec) => {
    const move = rec[1];
    return (
      move.src.file === toFile(from) &&
      move.src.rank === toRank(from) &&
      move.dest.file === toFile(to) &&
      move.dest.rank === toRank(to)
    );
  })[0];

  if (!move) throw new Error("Invalid move");

  client.move(move[0]);
};

const getPieces = (): string[] => {
  const res: string[] = Array(64).fill("e");
  let emptyCount = 0;

  client.game.board.squares.forEach((s) => {
    if (s.piece === null) return;
    const piece = s.piece.type === "pawn" ? "P" : s.piece.notation;
    res[toPos(s.rank, s.file)] =
      s.piece.side.name === "white" ? piece : piece.toLowerCase();
  });

  return res;
};

const bestMove = (): Move => {
  const start = performance.now();

  const depth = 2;
  const moves = Object.entries(client.notatedMoves);

  let bestMove: [string, Chess.NotatedMove] = moves[0];
  let bestEval = Number.NEGATIVE_INFINITY;

  for (const move of moves) {
    const playedMove = client.move(move[0]);
    const evaluation = search(
      depth,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
    if (bestEval < evaluation) {
      bestMove = move;
      bestEval = evaluation;
    }
    playedMove.undo();
  }

  console.log(`BestMove took: ${(performance.now() - start) / 1000}`);

  if (!bestMove) return { from: -1, to: -1 };

  const move = bestMove[1];
  return {
    from: toPos(move.src.rank, move.src.file),
    to: toPos(move.dest.rank, move.dest.file),
  };
};

// helpers --------------------------------------------------------------------

const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
const toPos = (rank: number, file: string): number =>
  (8 - rank) * 8 + files.indexOf(file);

const toFile = (pos: number): string => files[pos % 8];
const toRank = (pos: number): number => 8 - Math.floor(pos / 8);

// searching ------------------------------------------------------------------

const pieceValues: Map<string, number> = new Map([
  ["bishop", 3],
  ["knight", 3],
  ["rook", 5],
  ["queen", 9],
  ["pawn", 1],
  ["king", 0]
]);

const valueOfPiece = (p: string): number => {
  const val = pieceValues.get(p);
  if (val === undefined) throw new Error("Invalid Piece " + p);
  return val;
};

const countPieces = (): number => {
  let res = 0;

  for (const p of client.game.board.squares) {
    if (p.piece === null) continue;
    const val = valueOfPiece(p.piece.type);
    res += p.piece.side.name === turn ? val : -val;
  }

  return res;
};

const search = (depth: number, alpha: number, beta: number): number => {
  if (depth === 0) {
    return searchCaptures(alpha, beta);
  }

  const moves = client.notatedMoves;
  if (Object.keys(moves).length === 0) {
    if (client.isCheck) return Number.NEGATIVE_INFINITY;
    return 0;
  }

  for (const move of Object.entries(moves)) {
    const playedMove = client.move(move[0]);
    const evaluation = -search(depth - 1, -beta, -alpha);
    playedMove.undo();
    if (evaluation >= beta) return beta;
    alpha = Math.max(alpha, evaluation);
  }

  return alpha;
};

const searchCaptures = (alpha: number, beta: number): number => {
  const evaluation = countPieces();
  if (evaluation >= beta) return beta;

  alpha = Math.max(alpha, evaluation);

  const captureMoves = Object.entries(client.notatedMoves).filter(
    (m) => m[1].dest.piece !== null
  );

  for (const move of captureMoves) {
    const playedMove = client.move(move[0]);
    const evaluation = -searchCaptures(-beta, -alpha);
    playedMove.undo();
    if (evaluation >= beta) return beta;
    alpha = Math.max(alpha, evaluation);
  }

  return alpha;
};
