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

ctx.fillStyle = "black";
ctx.strokeStyle = "white";

// const koi = {
//   t: 0,
//   delay: Math.PI / 2.5,
//   bodyOffset: 20,
//   scale: 50,
//   halfHeadSeparation: 25,
// };

const koi = new Koi(canvas.width / 2, canvas.height / 2, 30, 3);

let lastRan = Date.now();

function run() {
  const currTime = Date.now();
  const dt = (currTime - lastRan) / 1000;
  lastRan = currTime;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  koi.update(dt);
  koi.draw(ctx);

  // koi.pos = new Vector(canvas.width / 2, canvas.height / 2);
  // koi.t += 0.05;
  // ctx.beginPath();
  // ctx.moveTo(
  //   koi.pos.x +
  //     Math.sin(koi.t + 3 * koi.delay) * koi.bodyOffset +
  //     koi.halfHeadSeparation,
  //   koi.pos.y
  // );
  // ctx.bezierCurveTo(
  //   koi.pos.x +
  //     Math.sin(koi.t + 2 * koi.delay) * koi.bodyOffset +
  //     koi.halfHeadSeparation * (3 / 4),
  //   koi.pos.y + koi.scale,
  //   koi.pos.x +
  //     Math.sin(koi.t + koi.delay) * koi.bodyOffset +
  //     koi.halfHeadSeparation * (1 / 2),
  //   koi.pos.y + 2 * koi.scale,
  //   koi.pos.x + Math.sin(koi.t) * koi.bodyOffset,
  //   koi.pos.y + 3 * koi.scale
  // );
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.moveTo(
  //   koi.pos.x +
  //     Math.sin(koi.t + 3 * koi.delay) * koi.bodyOffset -
  //     koi.halfHeadSeparation,
  //   koi.pos.y
  // );
  // ctx.bezierCurveTo(
  //   koi.pos.x +
  //     Math.sin(koi.t + 2 * koi.delay) * koi.bodyOffset -
  //     koi.halfHeadSeparation * (3 / 4),
  //   koi.pos.y + koi.scale,
  //   koi.pos.x +
  //     Math.sin(koi.t + koi.delay) * koi.bodyOffset -
  //     koi.halfHeadSeparation * (1 / 2),
  //   koi.pos.y + 2 * koi.scale,
  //   koi.pos.x + Math.sin(koi.t) * koi.bodyOffset,
  //   koi.pos.y + 3 * koi.scale
  // );
  // ctx.stroke();

  requestAnimationFrame(run);
}

paramConfig.onLoad(run);
