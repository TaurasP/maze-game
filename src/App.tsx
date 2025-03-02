import React, { useState, useEffect } from "react";
import { generateMaze, Cell } from "./MazeGenerator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFlagCheckered,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const ROWS = 10;
const COLS = 10;

function App() {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [turns, setTurns] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    regenerateMaze();
  }, []);

  const regenerateMaze = () => {
    const newMaze = generateMaze(ROWS, COLS);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setTurns(0);
    setMessage("");
  };

  const movePlayer = (dx: number, dy: number) => {
    if (message) return; // Game over

    const { x, y } = playerPos;
    const cell = maze[y][x];
    const newX = x + dx;
    const newY = y + dy;

    if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) return;

    // Check for walls
    if (dx === -1 && cell.walls.left) return;
    if (dx === 1 && cell.walls.right) return;
    if (dy === -1 && cell.walls.top) return;
    if (dy === 1 && cell.walls.bottom) return;

    setPlayerPos({ x: newX, y: newY });
    setTurns(turns + 1);

    // Check for victory
    if (newX === COLS - 1 && newY === ROWS - 1) {
      setMessage(
        `Sveikinimai išėjus iš labirinto! Ėjimų skaičius: ${turns + 1}.`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowUp":
        movePlayer(0, -1);
        break;
      case "ArrowDown":
        movePlayer(0, 1);
        break;
      case "ArrowLeft":
        movePlayer(-1, 0);
        break;
      case "ArrowRight":
        movePlayer(1, 0);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: "none", marginTop: "20px" }}
    >
      <h1 className="text-center">Labirintas</h1>

      {/* Regenerate Maze Button */}
      <div className="text-center mb-4">
        <button className="btn btn-dark mt-3" onClick={regenerateMaze}>
          Pateikti naują labirintą
        </button>
      </div>

      <div className="maze-container">
        <div className="maze-grid">
          {maze.map((row, y) => (
            <div key={y} className="maze-row">
              {row.map((cell, x) => {
                const isPlayer = x === playerPos.x && y === playerPos.y;
                const isStart = x === 0 && y === 0;
                const isExit = x === COLS - 1 && y === ROWS - 1;
                const isPlayerAtExit = isPlayer && isExit;

                return (
                  <div
                    key={x}
                    className={`maze-cell ${
                      isPlayerAtExit
                        ? "player-cell-exit"
                        : isPlayer
                        ? "player-cell"
                        : isStart
                        ? "start-cell"
                        : isExit
                        ? "exit-cell"
                        : ""
                    }`}
                    style={{
                      borderTop: cell.walls.top ? "1px solid black" : "none",
                      borderRight: cell.walls.right
                        ? "1px solid black"
                        : "none",
                      borderBottom: cell.walls.bottom
                        ? "1px solid black"
                        : "none",
                      borderLeft: cell.walls.left ? "1px solid black" : "none",
                    }}
                  >
                    {isStart && <FontAwesomeIcon icon={faHouse} />}
                    {isExit && <FontAwesomeIcon icon={faFlagCheckered} />}
                    {isPlayer && !isPlayerAtExit && !isStart && (
                      <FontAwesomeIcon icon={faFaceSmile} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls text-center mt-3">
        <div className="control-row">
          <div
            className="arrow-button up"
            onClick={() => movePlayer(0, -1)}
          ></div>
        </div>
        <div className="control-row">
          <div
            className="arrow-button left"
            onClick={() => movePlayer(-1, 0)}
          ></div>
          <div
            className="arrow-button down"
            onClick={() => movePlayer(0, 1)}
          ></div>
          <div
            className="arrow-button right"
            onClick={() => movePlayer(1, 0)}
          ></div>
        </div>
      </div>

      {message && <h2 className="text-center mt-3">{message}</h2>}
    </div>
  );
}

export default App;
