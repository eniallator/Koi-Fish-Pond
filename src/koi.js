class Koi {
  static #bodyRadii = [1, 3 / 4, 1 / 2, 0];
  static #bodySectionCurveDelay = Math.PI / (5 / 2);
  static #bodySectionSpacing = 5;
  static #halfHeadSeparation = 2.5;
  static #bodyOffset = 2;
  static #colours = {
    eyes: "black",
    body: "#F2F3F4",
    highlights: "#FFD021",
    topMarkingsDark: "#E34427",
    topMarkingsLight: "#F16323",
  };

  #pos;
  #scale;
  #direction;
  #animationSpeed;

  #timeAlive;

  constructor(x, y, scale, animationSpeed = 1) {
    this.#pos = new Vector(x, y);
    this.#scale = scale;
    this.#timeAlive = 0;
    this.#animationSpeed = animationSpeed;
  }

  update(dt) {
    this.#timeAlive += dt * this.#animationSpeed;
  }

  #getBodyCenters() {
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

  #rotatePointOnCircumference(center, point, angle) {
    point.sub(center);
    const radius = point.getMagnitude();
    const offset = Vector.UP.multiply(radius);
    offset.setAngle(point.getAngle() + angle);
    return offset.add(center);
  }

  #getBodyAngles(bodyCenters) {
    return bodyCenters.map((center, i) => {
      let diff;
      if (i > 0 && i < bodyCenters.length - 1) {
        diff = bodyCenters[i - 1]
          .copy()
          .sub(center)
          .add(center.copy().sub(bodyCenters[i + 1]));
      } else if (i > 0) {
        diff = bodyCenters[i - 1].copy().sub(center);
      } else {
        diff = center.copy().sub(bodyCenters[i + 1]);
      }
      return diff.getAngle();
    });
  }

  #getBodyPoints(bodyCenters, bodyAngles) {
    return bodyCenters.map((center, i) => ({
      right: this.#rotatePointOnCircumference(
        center,
        new Vector(
          center.x + this.#scale * Koi.#halfHeadSeparation * Koi.#bodyRadii[i],
          center.y
        ),
        bodyAngles[i] + Math.PI / 2
      ),
      left: this.#rotatePointOnCircumference(
        center,
        new Vector(
          center.x + this.#scale * Koi.#halfHeadSeparation * Koi.#bodyRadii[i],
          center.y
        ),
        bodyAngles[i] - Math.PI / 2
      ),
    }));
  }

  draw(ctx) {
    const oldFillStyle = ctx.fillStyle;
    // Body goes from head to the tail
    const bodyCenters = this.#getBodyCenters();
    const bodyAngles = this.#getBodyAngles(bodyCenters);
    const bodyPoints = this.#getBodyPoints(bodyCenters, bodyAngles);
    ctx.fillStyle = Koi.#colours.body;
    ctx.beginPath();
    ctx.moveTo(bodyPoints[0].right.x, bodyPoints[0].right.y);
    ctx.bezierCurveTo(
      bodyPoints[1].right.x,
      bodyPoints[1].right.y,
      bodyPoints[2].right.x,
      bodyPoints[2].right.y,
      bodyCenters[3].x,
      bodyCenters[3].y
    );
    ctx.bezierCurveTo(
      bodyPoints[2].left.x,
      bodyPoints[2].left.y,
      bodyPoints[1].left.x,
      bodyPoints[1].left.y,
      bodyPoints[0].left.x,
      bodyPoints[0].left.y
    );
    ctx.arc(
      bodyCenters[0].x,
      bodyCenters[0].y,
      Koi.#halfHeadSeparation * this.#scale,
      bodyAngles[0] - Math.PI / 2,
      bodyAngles[0] + Math.PI / 2
    );
    ctx.fill();
    ctx.fillStyle = oldFillStyle;
  }
}
