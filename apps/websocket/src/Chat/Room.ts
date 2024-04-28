import { Chat } from "./Chat"
import {randomInt} from "crypto"

export class Room{
    roomId:number
    chat:Chat
    constructor(){
        this.roomId=randomInt(10000000)
        this.chat=new Chat();
    }
    getRoomId():number{
        return this.roomId
    }
    addUserToRoom(user:WebSocket){
        this.chat.addUser(user)
    }
    removeUserFromRoom(user:WebSocket){
        this.chat.removeUser(user)
    }
}