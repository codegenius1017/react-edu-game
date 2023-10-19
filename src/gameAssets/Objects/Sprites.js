import { CONST } from "./Global";
import { ShotTypes } from "./Shots";

export class Sprite {
  constructor({ position, imageSrc, width, height, finalCordinates }) {
    this.initialPosition = { ...position };
    this.position = position;
    this.width = width;
    this.height = height;
    this.finalCordinates = finalCordinates;
    this.image = new Image(1000, 1000);
    this.image.src = imageSrc;
    this.imageSrc = imageSrc;
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  draw(c) {
    if (this.isLoaded)
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      );
  }

  move(
    finalPositionX = this.finalCordinates.x,
    finalPositionY = this.finalCordinates.y,
    cb,
    finalCb,
  ) {
    const goingDown = this.initialPosition.y < finalPositionY;
    const goingRigth = this.initialPosition.x < finalPositionX;
    const xDistanceMove = this.vel;

    if (goingDown && finalPositionY <= this.position.y) {
      this.active = false;
      if (finalCb) finalCb();
    } else if (!goingDown && finalPositionY >= this.position.y) {
      this.active = false;
      if (finalCb) finalCb();
    }

    if (goingDown && finalPositionY > this.position.y) {
      this.position.y += this.vel;
    } else if (!goingDown && finalPositionY < this.position.y)
      this.position.y -= this.vel;

    if (goingRigth && finalPositionX !== undefined && finalPositionX > this.position.x) {
      this.position.x += xDistanceMove;
      if (this.position.x + xDistanceMove === finalPositionX) this.onEndSide = "right";
    } else if (
      !goingRigth &&
      finalPositionX !== undefined &&
      finalPositionX < this.position.x
    ) {
      this.position.x -= xDistanceMove;
      if (this.position.x - xDistanceMove === finalPositionX) this.onEndSide = "left";
    }

    if (cb) cb();
  }
}

export class AsteroidSprite extends Sprite {
  constructor(props) {
    super(props);
    this.cbFalling = props.cbFalling;
    this.cbEndFall = props.cbEndFall;
    this.finalCordinates = props.finalCordinates;
    this.vel = props.vel;
    this.damage = props.damage;
    this.isAnimating = false;
    this.active = true;
    this.health = props.health;
    this.type = props.type;
    this.gameScreen = {
      width: props.gameScreenWidth,
      height: props.gameScreenHeight,
    };
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  clearCanvas(c) {
    c.clearRect(
      this.position.x,
      this.position.y - this.vel,
      this.width,
      this.height,
    );
  }

  move(finalPositionX = this.finalCordinates.x, finalPositionY = this.finalCordinates.y, cb, finalCb) {
    switch (this.type) {
      case "ZIGZAG":
        if (this.onEndSide === "right" || this.finalCordinates.x === undefined) this.finalCordinates.x = 0;
        if (this.onEndSide === "left" || this.finalCordinates.x === undefined) this.finalCordinates.x = this.gameScreen.width;

        this.onEndSide = undefined;

        super.move(this.finalCordinates.x, finalPositionY, cb, finalCb);
        break;
      default:
        super.move(finalPositionX, finalPositionY, cb, finalCb);
        break;
    }
  }

  draw(c) {
    if (this.isLoaded)
      c.drawImage(
        this.image,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height,
      );
  }
}

export class Shot extends Sprite {
  constructor({
    width,
    height,
    duration,
    color,
    damage,
    position,
    finalCordinates,
    finalSizes,
    vel,
    spaceshipData,
  }) {
    super({ width, height, position, finalCordinates });
    this.duration = duration;
    this.color = color;
    this.damage = damage;
    this.finalSizes = finalSizes;
    this.spaceshipData = spaceshipData;
    this.vel = vel;
    this.active = true;
  }

  draw(c) {
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      0,
      2 * Math.PI,
    );
    c.fill();
  }

  moveUntilFinalCordinates(
    finalPositionX = this.finalCordinates.x,
    finalPositionY = this.finalCordinates.y,
  ) {
    if (this.intervalMove) clearInterval(this.intervalMove);

    this.intervalMove = setInterval(() => {
      if (!this.active) {
        this.destroyIntervals();
        return;
      }

      if (finalPositionY >= this.position.y) {
        this.active = false;
        clearInterval(this.intervalMove);
      }

      if (finalPositionY > this.position.y) this.position.y += this.vel;
      if (finalPositionX && finalPositionX > this.position.x)
        this.position.x += this.vel;
      if (finalPositionY < this.position.y) this.position.y -= this.vel;
      if (finalPositionX && finalPositionX < this.position.x)
        this.position.x -= this.vel;
    }, CONST.defaultInterval);
  }

  expandUntilFinalSize(
    c,
    finalWidth = this.finalSizes.width,
    finalHeight = this.finalSizes.height,
  ) {
    if (this.intervalExpand) clearInterval(this.intervalExpand);

    this.intervalExpand = setInterval(() => {
      if (finalWidth > this.width) this.width += this.vel;
      if (finalHeight > this.height) this.height += this.vel;
      if (finalWidth < this.width) this.width -= this.vel;
      if (finalHeight < this.height) this.height -= this.vel;

      this.draw(c);
    }, CONST.velSizingAnimation);
  }

  destroyIntervals() {
    if (this.intervalExpand) clearInterval(this.intervalExpand);
    if (this.intervalMove) clearInterval(this.intervalMove);
    if (this.timeout) clearTimeout(this.timeout);
    if (this.moveTimeOut) clearTimeout(this.moveTimeOut);
  }
}

export class SpaceShipSprite extends Sprite {
  constructor({
    damage,
    position,
    width,
    height,
    imageSrc,
    shotType = "default",
    maxPositions,
    vel,
    munition,
    initialMunition,
    cooldown,
  }) {
    super({
      position,
      width,
      height,
      imageSrc,
    });

    this.damage = damage;
    this.isAnimating = false;
    this.shots = [];
    this.shotType = shotType;
    this.maxPositions = maxPositions;
    this.vel = vel;
    this.active = true;
    this.munition = munition;
    this.initialMunition = initialMunition;
    this.cooldown = cooldown;
  }

  move({ top = 0, bottom = 0, right = 0, left = 0, canvasCtx }) {
    if (!this.active) return;
    if (
      this.position.x + right + this.width - this.width / 3 <=
      this.maxPositions.x
    ) {
      this.position.x += right;
    }

    if (this.position.x - left >= 0 - this.width / 3) this.position.x -= left;
    if (this.position.y + bottom + this.height / 2 <= this.maxPositions.y)
      this.position.y += bottom;
    if (this.position.y - top >= 0 - this.height / 2) this.position.y -= top;

    if (this.isLoaded) {
      this.draw(canvasCtx);
    }
  }

  shoot(type) {
    const shots = ShotTypes[type || this.shotType].getSprite(this);

    shots.forEach((shot) => {
      shot.move();
    });

    return shots
  }
}
