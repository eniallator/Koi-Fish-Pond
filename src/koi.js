class Koi {
  static #bodyRadii = [1, 3 / 4, 1 / 2, 0];
  static #bodySectionCurveDelay = Math.PI * (2 / 5);
  static #bodySectionSpacing = 5;
  static #halfHeadSeparation = 2.5;
  static #bodyOffset = 2;
  static #swimSpeedMultiplier = 40;
  static #colours = {
    eyes: "black",
    body: "#F2F3F4",
    highlights: "#FFD021",
    topMarkingsDark: "#E34427",
    topMarkingsLight: "#F16323",
  };
  static #images = {
    finRight: { src: "images/fin-right.png" },
    finLeft: { src: "images/fin-left.png" },
    tail: { src: "images/tail.png" },
  };

  #pos;
  #scale;
  #angle;
  #swimSpeed;

  #timeAlive;

  static getImages() {
    for (let key of Object.keys(this.#images)) {
      if (this.#images[key].imageData === undefined) {
        const currImg = this.#images[key];
        const tmpImg = new Image();
        tmpImg.onload = () => {
          currImg.imageData = tmpImg;
          currImg.size = new Vector(tmpImg.width, tmpImg.height).getMagnitude();
        };
        tmpImg.src = currImg.src;
      }
    }
  }

  constructor(initialPos, initialAngle, scale, swimSpeed = 1) {
    this.#pos = initialPos;
    this.#angle = initialAngle;
    this.#scale = scale;
    this.#timeAlive = 0;
    this.#swimSpeed = swimSpeed;
  }

  update(dt) {
    this.#timeAlive += dt * this.#swimSpeed;
  }

  #getBodyCenters() {
    return new Array(4)
      .fill()
      .map(
        (_, i) =>
          new Vector(
            Math.sin(this.#timeAlive + (3 - i) * Koi.#bodySectionCurveDelay) *
              this.#scale *
              Koi.#bodyOffset,
            i * this.#scale * Koi.#bodySectionSpacing
          )
      )
      .map((center) =>
        new Vector(
          Math.cos(this.#angle) * center.x - Math.sin(this.#angle) * center.y,
          Math.sin(this.#angle) * center.x + Math.cos(this.#angle) * center.y
        ).add(this.#pos)
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

  #drawImage(ctx, img, x, y, sx, sy, angle) {
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(
      img,
      (-img.width / 2) * sx,
      (-img.height / 2) * sy,
      img.width * sx,
      img.height * sy
    );
    ctx.rotate(-angle);
    ctx.translate(-x, -y);
  }

  #drawFins(ctx, bodyCenters, bodyAngles, bodyPoints) {
    if (!Koi.#images.finLeft.imageData || !Koi.#images.finRight.imageData) {
      return;
    }
    const finScale = this.#scale / 50;
    const lerpPercent = 0.5;
    const rotationAngle = Math.PI / 1.9;
    const forwardOffset = new Vector(0, finScale * 300);

    const frontFins = {
      right: bodyCenters[0]
        .lerp(bodyPoints[0].right, lerpPercent)
        .add(
          new Vector(
            Koi.#images.finRight.imageData.width * finScale * 0.4,
            0
          ).setAngle(bodyAngles[1] + Math.PI / 2),
          forwardOffset.setAngle(bodyAngles[0] + Math.PI)
        ),
      left: bodyCenters[0]
        .lerp(bodyPoints[0].left, lerpPercent)
        .add(
          new Vector(
            Koi.#images.finLeft.imageData.width * finScale * 0.4,
            0
          ).setAngle(bodyAngles[1] - Math.PI / 2),
          forwardOffset.setAngle(bodyAngles[0] + Math.PI)
        ),
    };

    this.#drawImage(
      ctx,
      Koi.#images.finRight.imageData,
      frontFins.right.x,
      frontFins.right.y,
      finScale,
      finScale,
      bodyAngles[1] + rotationAngle
    );
    this.#drawImage(
      ctx,
      Koi.#images.finLeft.imageData,
      frontFins.left.x,
      frontFins.left.y,
      finScale,
      finScale,
      bodyAngles[1] + Math.PI - rotationAngle
    );
  }

  #drawTail(ctx, bodyCenters, bodyAngles) {
    if (!Koi.#images.tail.imageData) {
      return;
    }
    const tailScale = this.#scale / 70;
    const tailPos = new Vector((Koi.#images.tail.size * tailScale) / 2.3, 0)
      .setAngle(bodyAngles[3] + Math.PI)
      .add(bodyCenters[3]);
    this.#drawImage(
      ctx,
      Koi.#images.tail.imageData,
      tailPos.x,
      tailPos.y,
      tailScale,
      tailScale,
      bodyAngles[3] + Math.PI * 1.24
    );
  }

  #drawBody(ctx, bodyCenters, bodyAngles, bodyPoints) {
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
  }

  #drawEyes(ctx, bodyCenters, bodyAngles) {
    ctx.fillStyle = "black";
    const eyeAngle = Math.PI / 3;
    const rightPos = new Vector(Koi.#halfHeadSeparation * this.#scale * 0.95, 0)
      .setAngle(bodyAngles[0] + eyeAngle)
      .add(bodyCenters[0]);
    const leftPos = new Vector(Koi.#halfHeadSeparation * this.#scale * 0.95, 0)
      .setAngle(bodyAngles[0] - eyeAngle)
      .add(bodyCenters[0]);
    ctx.beginPath();
    ctx.arc(rightPos.x, rightPos.y, 0.3 * this.#scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(leftPos.x, leftPos.y, 0.3 * this.#scale, 0, 2 * Math.PI);
    ctx.fill();
  }

  draw(ctx) {
    const oldFillStyle = ctx.fillStyle;

    // Body goes from head to the tail
    const bodyCenters = this.#getBodyCenters();
    const bodyAngles = this.#getBodyAngles(bodyCenters);
    const bodyPoints = this.#getBodyPoints(bodyCenters, bodyAngles);

    this.#drawFins(ctx, bodyCenters, bodyAngles, bodyPoints);
    this.#drawTail(ctx, bodyCenters, bodyAngles);
    this.#drawBody(ctx, bodyCenters, bodyAngles, bodyPoints);
    this.#drawEyes(ctx, bodyCenters, bodyAngles);

    ctx.fillStyle = oldFillStyle;
  }

  set scale(scale) {
    this.#scale = scale;
  }

  set pos(vec) {
    this.#pos.setHead(vec);
  }

  set angle(angle) {
    this.#angle = angle;
  }
}

Koi.getImages();
