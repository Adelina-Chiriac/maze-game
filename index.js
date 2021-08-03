const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

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

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}));


// Walls
const walls = [
    // top
    Bodies.rectangle(400, 0, 800, 40, {
        isStatic: true
    }),
    // right
    Bodies.rectangle(800, 300, 40, 600, {
        isStatic: true
    }),
    // bottom
    Bodies.rectangle(400, 600, 800, 40, {
        isStatic: true
    }),
    // left
    Bodies.rectangle(0, 300, 40, 600, {
        isStatic: true
    })
];  

World.add(world, walls);

World.add(world, Bodies.rectangle(200, 200, 50, 50));