import express from "express";
import cors from "cors";
import { ChessBot } from "./ChessBot";

// express
const app = express();
app.use(express.json());
const port = 8000;
app.use(cors());

// globals
const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
let client: ChessBot;

// api
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create", (req, res) => {
  console.log("/create");
  client = new ChessBot(fen);
  res.status(200).send("Success");
});

app.get("/validMoves", (req, res) => {
  console.log("/validMoves");

  if (!client) {
    res.status(400).send("Error: call /create, board not initialised");
  } else {
    try {
      res.status(200).send(JSON.stringify(client.validMoves()));
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
      client.executeMove(parseInt(fr), parseInt(to));
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
      res.status(200).send(JSON.stringify(client.bestMove()));
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
      res.status(200).send(JSON.stringify(client.getPieces()));
    } catch (error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
});

app.listen(port, () => {
  console.log(`Chess app listening on port ${port}`);
});
