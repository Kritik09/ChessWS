import { MESSAGE } from "../constants";

export class Chat{
    private messages:Message[]
    private users:WebSocket[]
    constructor(){
        this.users=[];
        this.messages=[]
    }
    addUser(user:WebSocket){
        this.users.push(user);
        this.addHandlers(user);
    }
    removeUser(user:WebSocket){
        if(this.users.includes(user)){
            this.users=this.users.filter((us)=>us!==user);
            user.onmessage=null;
        }
    }
    addHandlers(user:WebSocket){
        user.onmessage=(event:MessageEvent)=>{
            const message=JSON.parse(event.data)
            if(message.type===MESSAGE){
                this.receiveMessage(user,message?.message)
            }
        }
    }
    receiveMessage(sendBy:WebSocket,message:string){
        const users=this.users.filter((user)=>user!==sendBy)
        this.messages.push({from:sendBy,message:message})
        users.forEach(element => {
            element.send(JSON.stringify(
                {
                    type:MESSAGE,
                    message:message
                }
            ))    
        });
    }
}