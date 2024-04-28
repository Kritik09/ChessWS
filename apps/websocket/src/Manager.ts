import { Room } from "./Chat/Room"
import { CREATE_ROOM, ERROR, ERROR_JSON, ERROR_ROOM_DOESNT_EXIST, JOIN_ROOM, ROOM_CREATED, ROOM_JOINED } from "./constants"

export class Manager{
    users:WebSocket[]
    rooms:{room:Room,roomId:number}[]
    constructor(){
        this.users=[]
        this.rooms=[]
    }
    addUser(user:WebSocket){
        this.addHandlers(user)
    }
    addHandlers(user:WebSocket){
        user.onmessage=(event:MessageEvent)=>{
            const message=JSON.parse(event.data)
            if(message?.type===CREATE_ROOM){
                const roomId=this.createRoom(user);
                user.send(JSON.stringify(
                    {
                        type:ROOM_CREATED,
                        roomId:roomId
                    }
                ))
            }
            if(message.type===JOIN_ROOM){
                const roomId=message?.roomId
                try{
                    this.joinRoom(user,roomId)
                    user.send(JSON.stringify(
                        {
                            type:ROOM_JOINED,
                        }
                    ))
                }
                catch(e){
                    user.send(JSON.stringify(
                        {
                            type:ERROR,
                            message:ERROR_ROOM_DOESNT_EXIST
                        }
                    ))
                }
            }
        }
    }
    createRoom(user:WebSocket):number{
        const room=new Room();
        room.addUserToRoom(user);
        this.rooms.push({room:room,roomId:room.getRoomId()})
        return room.getRoomId();
    }
    joinRoom(user:WebSocket,roomId:number){
        const room=this.rooms.find((room)=>roomId===room.roomId)
        if(room){
            room.room.addUserToRoom(user)
        }else{
            throw new Error("Room doesn't exist")
        }
    }
}