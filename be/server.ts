import express from "express";
import ChessBoard from "./ChessBoard";
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())
const port = 8000;

let chessBoard: ChessBoard;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/create", (req, res) => {
    console.log("/create");
    const fen = req.body.fen;
    console.log(req.body);
    if (!fen) {
        res.status(400).send("No fen given!");
    } else {
        chessBoard = ChessBoard.fromFen(fen);
        res.status(200).send("Create Request Successful")
    }
});

app.get("/validMoves", (req, res) => {
    console.log("/validMoves")
    let color = req.query.color;
    if (!chessBoard) {
        res.status(400).send("No board created");
    } else if (!color) {
        res.status(400).send(`${color} not valid color`);
    } else {
        return res.status(200).send(JSON.stringify(chessBoard.validMoves(color as string)));
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
