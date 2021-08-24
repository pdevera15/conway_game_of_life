import { useState, useCallback, useRef } from "react";
import { produce } from "immer";
const numRows = 50;
const numCols = 50;

const neighbors = [
  // North
  [-1, 0],
  // South
  [+1, 0],
  // West
  [0, -1],
  // East
  [0, +1],
  // NorthWest
  [-1, -1],
  // NorthEast
  [-1, +1],
  // SouthEast
  [+1, +1],
  // SouthWest
  [+1, -1],
];
function App() {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    let rows = [];
    for (let x = 0; x < numRows; x++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const run = useRef(running);
  const runSimulation = useCallback(() => {
    if (!run.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighborsCount = 0;
            neighbors.forEach(([x, y]) => {
              let newI = i + x;
              let newK = k + y;
              if (newK < numCols && newK >= 0 && newI < numRows && newI >= 0) {
                neighborsCount += g[newI][newK];
              }
              if (neighborsCount < 2 || neighborsCount > 3) {
                gridCopy[i][k] = 0;
              } else if (g[i][k] === 0 && neighbors === 3) {
                gridCopy[i][k] = 1;
              }
            });
          }
        }
      });
    });

    setTimeout(runSimulation, 1000);
  }, []);
  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            run.current = true;
            runSimulation();
          }
        }}
      >
        {run.current ? "Stop" : "Start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((col, k) => (
            <div
              key={`${i} - ${k}`}
              onClick={() => {
                let newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                border: "1px solid black",
                background: grid[i][k] ? "pink" : undefined,
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
