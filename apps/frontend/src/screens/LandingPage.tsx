import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"
import { CREATE_ROOM, JOIN_ROOM, ROOM_CREATED, ROOM_JOINED } from "../utils/constants";
import ChatWindow from "../components/ChatWindow";

export default function LandingPage() {
    const socket = useSocket();
    const [inputRoomId, setInputRoomId] = useState('');
    const [roomId, setRoomId] = useState<number | null>(null);
    const createRoom = () => {
        socket?.send(JSON.stringify(
            {
                type: CREATE_ROOM
            }
        ))
    }
    const joinRoom = () => {
        if (!inputRoomId) return;
        socket?.send(JSON.stringify(
            {
                type: JOIN_ROOM,
                roomId: parseInt(inputRoomId, 10)
            }
        ))
    }
    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            if (message.type === ROOM_CREATED) {
                setRoomId(message.roomId)
            }
            if (message.type === ROOM_JOINED) {
                setRoomId(parseInt(inputRoomId, 10))
            }
        }
    }, [socket, inputRoomId])
    return (
        <div className="h-5/6 w-full flex justify-center items-center">
            {roomId ? <ChatWindow socket={socket} roomId={roomId} /> :
                <div className="flex items-center justify-center flex-col">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10" onClick={createRoom}>Create Room</button>
                    <div>
                        <input type="text" className="m-2 p-2" placeholder="Enter room id" value={inputRoomId} onChange={(event) => setInputRoomId(event.target.value)} />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={joinRoom}>Join Room</button>

                    </div>

                </div>
            }
        </div>
    )
}
