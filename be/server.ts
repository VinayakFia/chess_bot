import express from "express";
import ChessBoard from "./ChessBoard";
const app = express();
app.use(express.json());
const port = 5000;

let chessBoard: ChessBoard;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/create", (req, res) => {
    const fen = req.body.fen;
    if (!fen) {
        res.status(400).send("No fen given!");
    } else {
        chessBoard = ChessBoard.fromFen(fen);
        res.status(200).send("Create Request Successful")
    }
});

app.get("/validMoves", (req, res) => {
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
