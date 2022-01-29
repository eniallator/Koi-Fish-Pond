class Koi {
  static #bodySectionCurveDelay = Math.PI / (5 / 2);
  static #bodySectionSpacing = 5;
  static #halfHeadSeparation = 2.5;
  static #bodyOffset = 2;

  #pos;
  #scale;
  #direction;

  #timeAlive;

  constructor(x, y, scale) {
    this.#pos = new Vector(x, y);
    this.#scale = scale;
    this.#timeAlive = 0;
  }

  update(dt) {
    this.#timeAlive += dt;
  }

  #getBodySegmentPositions() {
    // Goes from head to the tail
    return new Array(4)
      .fill()
      .map(
        (_, i) =>
          new Vector(
            this.#pos.x +
              Math.sin(this.#timeAlive + (3 - i) * Koi.#bodySectionCurveDelay) *
                this.#scale *
                Koi.#bodyOffset,
            this.#pos.y + i * this.#scale * Koi.#bodySectionSpacing
          )
      );
  }

  draw(ctx) {
    const bodyPos = this.#getBodySegmentPositions();
    ctx.beginPath();
    ctx.moveTo(
      bodyPos[0].x + this.#scale * Koi.#halfHeadSeparation,
      bodyPos[0].y
    );
    ctx.bezierCurveTo(
      bodyPos[1].x + this.#scale * Koi.#halfHeadSeparation * (3 / 4),
      bodyPos[1].y,
      bodyPos[2].x + this.#scale * Koi.#halfHeadSeparation * (1 / 2),
      bodyPos[2].y,
      bodyPos[3].x,
      bodyPos[3].y
    );
    ctx.bezierCurveTo(
      bodyPos[2].x - this.#scale * Koi.#halfHeadSeparation * (1 / 2),
      bodyPos[2].y,
      bodyPos[1].x - this.#scale * Koi.#halfHeadSeparation * (3 / 4),
      bodyPos[1].y,
      bodyPos[0].x - this.#scale * Koi.#halfHeadSeparation,
      bodyPos[0].y
    );
    ctx.arc(
      bodyPos[0].x,
      bodyPos[0].y,
      Koi.#halfHeadSeparation * this.#scale,
      Math.PI,
      0
    );
    ctx.stroke();
  }
}
