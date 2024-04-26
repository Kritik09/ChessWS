import { WebSocketServer } from "ws";
import { GameManager } from "./Game/GameManager";
const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();
wss.on("connection", (ws)=> {
  gameManager.addUser(ws);
});