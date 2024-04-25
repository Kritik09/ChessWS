import { useState } from "react";
import { MOVE } from "../../../backend/src/message";
import { BLACK } from "../utils/constants";
export default function ChessBoard({
  board,
  socket,
  setBoard,
  chess,
  isTurn,
  setIsTurn,
  myColor,
  movesPlayed,
  setMovesPlayed,
}) {
  console.log(board);
  const [from, setFrom] = useState();
  const [legalMoves, setLegalMoves] = useState(null);
  const toChessNotation = (rowIndex, colIndex) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const file = letters[colIndex];
    const rank = 8 - rowIndex;
    return `${file}${rank}`;
  };
  const handleClick = (i, j) => {
    return () => {
      if (!isTurn) {
        return;
      }
      if (!from) {
        setFrom(toChessNotation(i, j));
        setLegalMoves(
          chess
            .moves({ verbose: true, square: toChessNotation(i, j) })
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
        setLegalMoves(false);
        setBoard(chess.board());
      }
    };
  };
  const legalMovesCell = (i, j) => {
    if (!from) return "";
    var styles = "";
    if (
      legalMoves.find((obj) => {
        return obj.to == toChessNotation(i, j);
      })
    ) {
      styles = "border-2 border-green-400 rounded-2xl";
    }
    if (
      legalMoves.find((obj) => {
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
                  ${
                    (colKey + rowKey) % 2 ? "bg-yellow-100" : "bg-blue-100"
                  } w-20 flex justify-center items-center ${legalMovesCell(
                      rowKey,
                      colKey
                    )}`}
                    onClick={handleClick(rowKey, colKey)}
                  >
                    <img
                      src={`../src/assets/${square?.color + square?.type}.png`}
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
