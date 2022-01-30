const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse = new Mouse(canvas);
const paramConfig = new ParamConfig(
  "./config.json",
  document.querySelector("#cfg-outer")
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

let lastRan = Date.now();

function run() {
  const currTime = Date.now();
  const dt = (currTime - lastRan) / 1000;
  lastRan = currTime;
  ctx.fillStyle = "#1176AE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  koi.update(dt);
  koi.draw(ctx);

  requestAnimationFrame(run);
}

paramConfig.addListener((state) => (koi.scale = state.scale), ["scale"]);

paramConfig.onLoad(run);
