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

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(
      this.#pos.x +
        Math.sin(this.#timeAlive + 3 * Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset +
        this.#scale * Koi.#halfHeadSeparation,
      this.#pos.y
    );
    ctx.bezierCurveTo(
      this.#pos.x +
        Math.sin(this.#timeAlive + 2 * Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset +
        this.#scale * Koi.#halfHeadSeparation * (3 / 4),
      this.#pos.y + this.#scale * Koi.#bodySectionSpacing,
      this.#pos.x +
        Math.sin(this.#timeAlive + Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset +
        this.#scale * Koi.#halfHeadSeparation * (1 / 2),
      this.#pos.y + 2 * this.#scale * Koi.#bodySectionSpacing,
      this.#pos.x + Math.sin(this.#timeAlive) * this.#scale * Koi.#bodyOffset,
      this.#pos.y + 3 * this.#scale * Koi.#bodySectionSpacing
    );
    ctx.bezierCurveTo(
      this.#pos.x +
        Math.sin(this.#timeAlive + Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset -
        this.#scale * Koi.#halfHeadSeparation * (1 / 2),
      this.#pos.y + 2 * this.#scale * Koi.#bodySectionSpacing,
      this.#pos.x +
        Math.sin(this.#timeAlive + 2 * Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset -
        this.#scale * Koi.#halfHeadSeparation * (3 / 4),
      this.#pos.y + this.#scale * Koi.#bodySectionSpacing,
      this.#pos.x +
        Math.sin(this.#timeAlive + 3 * Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset -
        this.#scale * Koi.#halfHeadSeparation,
      this.#pos.y
    );
    ctx.arc(
      this.#pos.x +
        Math.sin(this.#timeAlive + 3 * Koi.#bodySectionCurveDelay) *
          this.#scale *
          Koi.#bodyOffset,
      this.#pos.y,
      Koi.#halfHeadSeparation * this.#scale,
      Math.PI,
      0
    );
    ctx.stroke();
  }
}
