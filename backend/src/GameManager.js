import { Game } from "./Game.js";
import { GAME_STARTED, INIT_GAME, IN_QUEUE, MOVE } from "./message.js";

export class GameManager {
  games = [];
  pendingUser = null;
  constructor() {}
  addUser(socket) {
    this.addHandler(socket);
  }
  removeUser(socket) {}
  addHandler(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          socket.send(
            JSON.stringify({
              type: GAME_STARTED,
              color: "black",
            })
          );
          this.pendingUser.send(
            JSON.stringify({
              type: GAME_STARTED,
              color: "white",
            })
          );
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
          socket.send(
            JSON.stringify({
              type: IN_QUEUE,
            })
          );
        }
      } else if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}
