class Boid {
  static #nextId = 0;

  #koi;

  constructor(x, y, directionAngle) {
    this.pos = new Vector(x, y);
    this.dirNorm = Vector.ONE.copy().setAngle(directionAngle);
    this.#koi = new Koi(Vector.ZERO, undefined, scale);

    this.id = Boid.#nextId++;
  }

  static newRandom() {
    return new Boid(Math.random(), Math.random(), Math.random() * 2 * Math.PI);
  }

  #getBoundaryAccelerationVec(wallDetectRadius) {
    const accelerationVec = Vector.ZERO.copy();

    if (this.pos.y < wallDetectRadius && this.dirNorm.dot(Vector.UP) > 0) {
      accelerationVec.add(
        Vector.DOWN.copy().multiply(
          Math.min(1, 1 - this.dirNorm.y / wallDetectRadius)
        )
      );
    }
    if (this.pos.x < wallDetectRadius && this.dirNorm.dot(Vector.LEFT) > 0) {
      accelerationVec.add(
        Vector.RIGHT.copy().multiply(
          Math.min(1, 1 - this.dirNorm.x / wallDetectRadius)
        )
      );
    }
    if (
      1 - this.pos.y < wallDetectRadius &&
      this.dirNorm.dot(Vector.DOWN) > 0
    ) {
      accelerationVec.add(
        Vector.UP.copy().multiply(
          Math.min(1, (1 - this.dirNorm.y) / wallDetectRadius)
        )
      );
    }
    if (
      1 - this.pos.x < wallDetectRadius &&
      this.dirNorm.dot(Vector.RIGHT) > 0
    ) {
      accelerationVec.add(
        Vector.LEFT.copy().multiply(
          Math.min(1, (1 - this.dirNorm.x) / wallDetectRadius)
        )
      );
    }

    return accelerationVec;
  }

  update(
    dt,
    boids,
    speed,
    wallDetectRadius,
    otherDetectRadius,
    separation,
    alignment,
    cohesion,
    aspectRatio
  ) {
    this.#koi.swimSpeed = speed * 20000;
    this.#koi.update(dt);
    const accelerationVec = this.#getBoundaryAccelerationVec(wallDetectRadius);

    const otherDetectRadiusSqr = otherDetectRadius * otherDetectRadius;
    const boidsInRange = boids.filter(
      (other) =>
        other.id !== this.id &&
        this.pos.copy().sub(other.pos).getSquaredMagnitude() <=
          otherDetectRadiusSqr,
      this
    );
    if (boidsInRange.length > 0) {
      const centerOfMass = Vector.ZERO.copy();
      const otherBoidsDirection = Vector.ZERO.copy();
      const closeMasses = Vector.ZERO.copy();
      for (let other of boidsInRange) {
        centerOfMass.add(other.pos);
        otherBoidsDirection.add(other.dirNorm);
        const posDiff = other.pos.copy().sub(this.pos);
        closeMasses.add(
          posDiff.setMagnitude(otherDetectRadius - posDiff.getMagnitude())
        );
      }
      centerOfMass.divide(boidsInRange.length);

      accelerationVec.add(centerOfMass.sub(this.pos).multiply(cohesion));
      accelerationVec.add(otherBoidsDirection.normalise().multiply(alignment));
      accelerationVec.add(
        closeMasses.multiply(-1).normalise().multiply(separation)
      );
    }

    this.dirNorm.add(accelerationVec).normalise();
    this.pos.add(
      this.dirNorm
        .copy()
        .multiply(1000 * dt * speed, new Vector(1, aspectRatio).normalise())
    );
  }

  draw(ctx, width, height, scale) {
    this.#koi.pos = new Vector(width, height).multiply(this.pos);
    this.#koi.angle = this.dirNorm.getAngle() + Math.PI / 2;
    this.#koi.scale = scale;
    this.#koi.draw(ctx);
  }
}
