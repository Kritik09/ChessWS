import React, { useState } from "react";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const IN_QUEUE = "in_queue";
export const GAME_STARTED = "game_started";
import { BLACK } from "../utils/constants";
export default function ChessBoard({ board, socket, setBoard,
  chess,
  isTurn,
  setIsTurn,
  myColor,
  setMovesPlayed,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][],
  socket: WebSocket,
  setBoard: React.Dispatch<React.SetStateAction<({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][]>>, chess: Chess, isTurn: boolean, setIsTurn: React.Dispatch<React.SetStateAction<boolean>>
  , myColor: string,
  setMovesPlayed: React.Dispatch<React.SetStateAction<({ to: string, from: string }[])>>,
}) {
  console.log(board);
  const [from, setFrom] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<{ to: Square, captured: PieceSymbol | undefined, promotion: PieceSymbol | undefined }[] | null>(null);
  const toChessNotation = (rowIndex: number, colIndex: number) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const file = letters[colIndex];
    const rank = 8 - rowIndex;
    return `${file}${rank}`;
  };
  const handleClick = (i: number, j: number) => {
    return () => {
      if (!isTurn) {
        return;
      }
      if (!from) {
        setFrom(toChessNotation(i, j));
        setLegalMoves(
          chess
            .moves({ verbose: true, square: toChessNotation(i, j) as Square })
            .map((move) => {
              return {
                to: move.to,
                captured: move.captured,
                promotion: move.promotion,
              };
            })
        );
      } else {
        try {
          chess.move({ from, to: toChessNotation(i, j) });
          setMovesPlayed((movesPlayed) => [
            ...movesPlayed,
            { from: from, to: toChessNotation(i, j) },
          ]);
        } catch (e) {
          setFrom(null);
          return;
        }
        socket.send(
          JSON.stringify({
            type: MOVE,
            move: {
              from,
              to: toChessNotation(i, j),
            },
          })
        );
        setFrom(null);
        setIsTurn(false);
        setLegalMoves(null);
        setBoard(chess.board());
      }
    };
  };
  const legalMovesCell = (i: number, j: number) => {
    if (!from) return "";
    let styles = "";
    if (
      legalMoves?.find((obj) => {
        return obj.to == toChessNotation(i, j);
      })
    ) {
      styles = "border-2 border-green-400 rounded-2xl";
    }
    if (
      legalMoves?.find((obj) => {
        return obj.to == toChessNotation(i, j) && obj.captured != null;
      })
    ) {
      styles = "border-2 border-red-400 rounded-2xl";
    }
    return styles;
  };
  return (
    <div className="flex">
      <div className="p-2 grid grid-rows-8 w-max">
        {board?.map((row, rowKey) => {
          return (
            <div key={rowKey} className="h-20 flex">
              {row?.map((square, colKey) => {
                return (
                  <div
                    key={colKey}
                    className={`col-span-1 
                  ${myColor === BLACK ? "rotate-180" : ""}
                  ${(colKey + rowKey) % 2 ? "bg-yellow-100" : "bg-blue-100"
                      } w-20 flex justify-center items-center ${legalMovesCell(
                        rowKey,
                        colKey
                      )}`}
                    onClick={handleClick(rowKey, colKey)}
                  >
                    <img
                      src={square ? `../src/assets/${square.color + square.type + ".png"}` : ""}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div></div>
    </div>
  );
}
