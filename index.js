const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 4;
const cellsVertical = 3;

const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();

// Disable gravity
engine.world.gravity.y = 0;

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
    Bodies.rectangle(width / 2, 0, width, 2, {
        isStatic: true
    }),
    // right
    Bodies.rectangle(width, height / 2, 2, height, {
        isStatic: true
    }), 
    // bottom
    Bodies.rectangle(width / 2, height, width, 2, {
        isStatic: true
    }),
    // left
    Bodies.rectangle(0, height / 2, 2, height, {
        isStatic: true
    })
];  

World.add(world, walls);


// Maze Generation
const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
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

// Draw the horizontal segments
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        // If there is no wall, return
        if (open) {
            return;
        }

        // If there is a wall, draw it at the proper coordinates
        const wall = Bodies.rectangle(
            // X direction
            columnIndex * unitLengthX + unitLengthX / 2,
            // Y direction
            rowIndex * unitLengthY + unitLengthY,
            // wall length (X axis)
            unitLengthX,
            // wall height (Y axis)
            5,
            {
                label: "wall", 
                isStatic: true
            }
        );

        // Add the wall to the maze (world)
        World.add(world, wall);
    });
});

// Draw the vertical segments
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        // If there is no wall, return
        if (open) {
            return;
        }

        // If there is a wall, draw it at the proper coordinates
        const wall = Bodies.rectangle(
            // X direction
            columnIndex * unitLengthX + unitLengthX,
            // Y direction
            rowIndex * unitLengthY + unitLengthY / 2,
            // wall length (X axis)
            5,
            // wall height (Y axis)
            unitLengthY,
            {
                label: "wall", 
                isStatic: true
            }
        );

        // Add the wall to the maze (world)
        World.add(world, wall);
    });
});

// Add the goal
const goal = Bodies.rectangle(
    // X direction
    width - unitLengthX / 2,
    // Y direction
    height - unitLengthY / 2,
    // length
    unitLengthX * 0.6,
    // height
    unitLengthY * 0.6,
    {
        label: "goal",
        isStatic: true
    }
);

World.add(world, goal);

// Add the ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    // X direction
    unitLengthX / 2,
    // Y direction
    unitLengthY / 2,
    // radius
    ballRadius,
    {
        label: "ball"
    }
);

World.add(world, ball);

document.addEventListener("keydown", event => {
    // Destructure ball velocity coordinates
    const { x, y } = ball.velocity;

    // move up
    if (event.keyCode === 87 || event.keyCode === 38) {
        Body.setVelocity(ball, { x: x, y: y - 5});
    }
    // move right
    if (event.keyCode === 68 || event.keyCode === 39) {
        Body.setVelocity(ball, { x: x + 5, y: y });
    }
    // move down
    if (event.keyCode === 83 || event.keyCode === 40) {
        Body.setVelocity(ball, { x: x, y: y + 5 });
    }
    // move left
    if (event.keyCode === 65 || event.keyCode === 37) {
        Body.setVelocity(ball, { x: x - 5, y: y });
    }
});

// Winning condition
Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        // Define label array for winning condition check
        const labels = ["ball", "goal"];

        // Check if winning condition is satisfied & if yes, add some animation to tell the user they won
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            // re-enable gravity
            world.gravity.y = 1;
            // animate the walls to crumble down
            world.bodies.forEach((body) => {
                if (body.label === "wall") {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});