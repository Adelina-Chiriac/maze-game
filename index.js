const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: width,
        height: height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);


// Walls
const walls = [
    // top
    Bodies.rectangle(width / 2, 0, width, 40, {
        isStatic: true
    }),
    // right
    Bodies.rectangle(width, height / 2, 40, height, {
        isStatic: true
    }), 
    // bottom
    Bodies.rectangle(width / 2, height, width, 40, {
        isStatic: true
    }),
    // left
    Bodies.rectangle(0, height / 2, 40, height, {
        isStatic: true
    })
];  

World.add(world, walls);

World.add(world, Bodies.rectangle(200, 200, 50, 50));

// Maze Generation
const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    
    return arr;
};

const moveThroughCell = (row, column) => {
    // Check if cell at grid[row, column] has been visited already. If yes, return
    if (grid[row][column]) {
        return;
    }

    // Mark cell as being visited
    grid[row][column] = true;
    
    // Create randomly-ordered list of neighbour cells
    const neighbours = shuffle([
        // Calculate coordinates of neighbour cells (based on current cell) and randomize the array by using the shuffle function
        [row - 1, column, "up"],
        [row, column + 1, "right"],
        [row + 1, column, "down"],
        [row, column - 1, "left"]
    ]);

    // Iterate through each neighbour
    for (let neighbour of neighbours) {
        // Extract the coordinates & direction of the neighbour we're thinking of visiting next
        const [nextRow, nextColumn, direction] = neighbour;

        // Check if this neighbour is out of bounds, and if yes, skip this element
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
            continue;
        }

        // Check to see if we visited this neighbour already
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        // Remove the wall from either the horizontals or verticals array, depending on the chosen direction
        if (direction === "left") {
            verticals[row][column - 1] = true;
        }
        else if (direction === "right") {
            verticals[row][column] = true;
        }
        else if (direction === "up") {
            horizontals[row - 1][column] = true;
        }
        else if (direction === "down") {
            horizontals[row][column] = true;
        }

        // Move to the next cell
        moveThroughCell(nextRow, nextColumn);
    }
};

moveThroughCell(startRow, startColumn);