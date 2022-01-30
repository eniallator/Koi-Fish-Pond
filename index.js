const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse = new Mouse(canvas);
const paramConfig = new ParamConfig(
  "./config.json",
  document.querySelector("#cfg-outer"),
  true
);
paramConfig.addCopyToClipboardHandler("#share-btn");

window.onresize = (evt) => {
  canvas.width = $("#canvas").width();
  canvas.height = $("#canvas").height();
};
window.onresize();

ctx.strokeStyle = "white";

const koi = new Koi(
  new Vector(canvas.width / 2 + 100, canvas.height / 2),
  Math.PI / 2,
  30,
  3
);

let boids = [];

function update(dt) {
  for (let boid of boids) {
    boid.update(
      dt,
      boids,
      paramConfig.getVal("koi_speed"),
      paramConfig.getVal("koi_wall_detection_radius"),
      paramConfig.getVal("other_koi_detection_radius"),
      paramConfig.getVal("koi_separation"),
      paramConfig.getVal("koi_alignment"),
      paramConfig.getVal("koi_cohesion"),
      canvas.width / canvas.height
    );
  }
}

function draw(ctx) {
  for (let boid of boids) {
    boid.draw(ctx, canvas.width, canvas.height, paramConfig.getVal("scale"));
  }
}

let lastRan = Date.now();
function run() {
  const currTime = Date.now();
  const dt = (currTime - lastRan) / 1000;
  lastRan = currTime;

  ctx.fillStyle = "#1176AE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  update(dt);
  draw(ctx);

  requestAnimationFrame(run);
}

paramConfig.addListener(
  (state) => (Koi.bodyColour = "#" + state["koi-colour"]),
  ["koi-colour"]
);

function init() {
  paramConfig.addListener(
    (state) => {
      const numBoids = state["num_koi"];
      if (boids.length === numBoids) return;
      if (boids.length > numBoids) {
        boids = boids.slice(boids.length - numBoids);
      } else {
        for (let i = boids.length; i < numBoids; i++) {
          boids.push(Boid.newRandom());
        }
      }
    },
    ["num_koi"]
  );

  paramConfig.tellListeners(true);
  run();
}

paramConfig.onLoad(init);
