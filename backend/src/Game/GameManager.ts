import { WebSocket } from "ws";
import {Game} from "./Game"
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const IN_QUEUE = "in_queue";
export const GAME_STARTED = "game_started";

export class GameManager {
  private games:Game[];
  private pendingUser:WebSocket|null;
  constructor() {
    this.games=[]
    this.pendingUser=null
  }
  addUser(socket:WebSocket) {
    this.addHandler(socket);
  }
  removeUser(socket:WebSocket) {}
  addHandler(socket:WebSocket) {
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
