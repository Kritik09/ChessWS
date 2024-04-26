import { useEffect, useState } from "react";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const IN_QUEUE = "in_queue";
export const GAME_STARTED = "game_started";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { BLACK, WHITE } from "../utils/constants";
import { Chess } from "chess.js";
export default function Game() {
  const socket = useSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [isTurn, setIsTurn] = useState(false);
  const [myColor, setMyColor] = useState<string>(BLACK);
  const [movesPlayed, setMovesPlayed] = useState<{ to: string, from: string }[]>([]);
  const [started, setStarted] = useState(false);
  const startGame = () => {
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === GAME_STARTED) {
        setBoard(chess.board());
        if (message.color === WHITE) {
          setMyColor(WHITE);
          setIsTurn(true);
          setBoard(chess.board())
        }
        setStarted(true);
      }
      if (message.type === MOVE) {
        const move = message.payload.move;
        chess.move(move);
        setBoard(chess.board());
        setMovesPlayed((movesPlayed) => [...movesPlayed, move]);
        setIsTurn(true);
      }
    };
  }, [socket, chess, board]);
  if (!socket) return <div>Connecting...</div>;
  return (
    <div className="flex justify-evenly p-4 w-screen h-screen">
      <div className="">
        {!started ? (
          <h1 className="text-white font-extrabold text-2xl">Find Board</h1>
        ) : (
          <div className={(myColor === BLACK ? "rotate-180" : "") + " p-2"}>
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
              isTurn={isTurn}
              setIsTurn={setIsTurn}
              myColor={myColor}
              setMovesPlayed={setMovesPlayed}
            />
          </div>
        )}
      </div>
      <div className="">
        {started ? (
          <div className="my-4 h-3/4 flex flex-col w-full bg-slate-400">
            <div className="flex justify-between">
              <div className="px-5">
                <h1>From</h1>
              </div>
              <div className="px-5">
                <h1>To</h1>
              </div>
            </div>
            <div className="overflow-x-hidden overflow-y-scroll">
              {movesPlayed.map((moves, index) => {
                return (
                  <div
                    className={`py-2 flex justify-between ${index % 2 ? "bg-slate-500" : "bg-slate-600"
                      }`}
                    key={index}
                  >
                    <div className="px-5">
                      <h1>{moves.from}</h1>
                    </div>
                    <div className="px-5">
                      <h1>{moves.to}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 font-bold text-white rounded"
            onClick={startGame}
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
}
