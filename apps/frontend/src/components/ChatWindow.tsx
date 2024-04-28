import { KeyboardEvent, useEffect, useState } from "react"
import { MESSAGE } from "../utils/constants"
import Message from "./Message"

interface props {
    socket: WebSocket | null,
    roomId: number
}

export default function ChatWindow({ socket, roomId }: props) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<string[]>([])
    const sendMessage = () => {
        if (message === '') return
        setMessages(messages => [...messages, message])
        socket?.send(JSON.stringify(
            {
                type: MESSAGE,
                message: message
            }
        ))
        setMessage('')
    }
    useEffect(() => {
        if (!socket) return
        socket.onmessage = (event: MessageEvent) => {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.type === MESSAGE) {
                setMessages(messages => [...messages, receivedMessage.message])
            }
        }
    }, [socket])
    const keydownEvent = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    }
    return (
        <div className='flex h-full w-full p-2 justify-center items-center flex-col'>
            <h1 className='font-bold text-2xl text-white'>Chatting (Room ID: {roomId})</h1>
            <div className='border h-3/4 w-full flex flex-col p-2 bg-sky-950 rounded overflow-y-scroll'>
                {messages.map((item, index) => {
                    return (
                        <div key={index}>
                            <Message message={item} />
                        </div>
                    )
                })}
            </div>
            <div className='w-full p-1'>
                <input type="text" className='h-10 w-5/6 px-2' value={message} placeholder="Type message to send" onChange={(event) => setMessage(event.target.value)} onKeyDown={keydownEvent} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
