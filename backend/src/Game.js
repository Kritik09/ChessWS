import { Chess } from "chess.js";
import { GAME_OVER, MOVE } from "./message.js";

export class Game {
  board;
  moves = [];
  player1;
  player2;
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
  }
  makeMove(socket, move) {
    if (this.board.turn() === "w" && this.player1 !== socket) {
      return;
    }
    if (this.board.turn() === "b" && this.player2 !== socket) {
      return;
    }
    try {
      this.board.move(move);
      this.moves.push(move);
    } catch (e) {
      return;
    }
    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn(),
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn(),
          },
        })
      );
    }
    if (this.board.turn() === "b") {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
          },
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
          },
        })
      );
    }
    this.moves.push(move);
  }
}
