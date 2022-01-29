class Koi {
  static #bodyRadii = [1, 3 / 4, 1 / 2, 0];
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
          center.x - this.#scale * Koi.#halfHeadSeparation * Koi.#bodyRadii[i],
          center.y
        ),
        bodyAngles[i] - (Math.PI * 3) / 2
      ),
    }));
  }

  draw(ctx) {
    // Body goes from head to the tail
    const bodyCenters = this.#getBodySegmentPositions();
    const bodyAngles = this.#getBodyAngles(bodyCenters);
    const points = this.#getBodyPoints(bodyCenters, bodyAngles);
    ctx.beginPath();
    ctx.moveTo(points[0].right.x, points[0].right.y);
    ctx.bezierCurveTo(
      points[1].right.x,
      points[1].right.y,
      points[2].right.x,
      points[2].right.y,
      bodyCenters[3].x,
      bodyCenters[3].y
    );
    ctx.bezierCurveTo(
      points[2].left.x,
      points[2].left.y,
      points[1].left.x,
      points[1].left.y,
      points[0].left.x,
      points[0].left.y
    );
    ctx.arc(
      bodyCenters[0].x,
      bodyCenters[0].y,
      Koi.#halfHeadSeparation * this.#scale,
      bodyAngles[0] - Math.PI / 2,
      bodyAngles[0] + Math.PI / 2
    );
    ctx.stroke();
  }
}
