const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

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

console.log(startRow, startColumn);