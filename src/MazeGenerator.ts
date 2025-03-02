export type Cell = {
    x: number;
    y: number;
    walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
    visited: boolean;
  };
  
  export function generateMaze(rows: number, cols: number): Cell[][] {
    const grid: Cell[][] = [];
    // Initialize grid
    for (let y = 0; y < rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < cols; x++) {
        row.push({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        });
      }
      grid.push(row);
    }
  
    // Stack for DFS
    const stack: Cell[] = [];
    const startCell = grid[0][0];
    startCell.visited = true;
    stack.push(startCell);
  
    while (stack.length > 0) {
      const current = stack.pop()!;
      const neighbors = getUnvisitedNeighbors(current, grid);
  
      if (neighbors.length > 0) {
        stack.push(current);
  
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWalls(current, next);
        next.visited = true;
        stack.push(next);
      }
    }
  
    return grid;
  }
  
  function getUnvisitedNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
    const { x, y } = cell;
    const neighbors: Cell[] = [];
  
    const directions = [
      { dx: 0, dy: -1, wall: 'top', oppositeWall: 'bottom' },
      { dx: 1, dy: 0, wall: 'right', oppositeWall: 'left' },
      { dx: 0, dy: 1, wall: 'bottom', oppositeWall: 'top' },
      { dx: -1, dy: 0, wall: 'left', oppositeWall: 'right' },
    ];
  
    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (grid[ny] && grid[ny][nx] && !grid[ny][nx].visited) {
        neighbors.push(grid[ny][nx]);
      }
    }
  
    return neighbors;
  }
  
  function removeWalls(a: Cell, b: Cell) {
    const x = a.x - b.x;
    if (x === 1) {
      a.walls.left = false;
      b.walls.right = false;
    } else if (x === -1) {
      a.walls.right = false;
      b.walls.left = false;
    }
  
    const y = a.y - b.y;
    if (y === 1) {
      a.walls.top = false;
      b.walls.bottom = false;
    } else if (y === -1) {
      a.walls.bottom = false;
      b.walls.top = false;
    }
  }  