import { WebSocketServer } from "ws";
import { Manager } from "./Manager";
const wss = new WebSocketServer({port:3000})
const manager=new Manager();
wss.on("connection",(ws:WebSocket)=>{
    manager.addUser(ws);
})