import { CONST } from "./Global";
import { ShotTypes } from "./Shots";

export class Sprite {
  constructor({ position, imageSrc, width, height }) {
    this.position = position;
    this.width = width;
    this.height = height;
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
}

export class AsteroidSprite extends Sprite {
  constructor(props) {
    super(props);

    this.cbFalling = props.cbFalling;
    this.cbFalling = props.cbEndFall;
    this.gameScreenHeight = props.gameScreenHeight;
    this.vel = props.vel;
    this.damage = props.damage;
    this.isAnimating = false;
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  fall() {
    if (this.intervalFall) clearInterval(this.intervalFall);

    this.intervalFall = setInterval(() => {
      if (this.position.y < this.gameScreenHeight) {
        this.position.y += this.vel;
      } else {
        clearInterval(this.intervalFall);
        if (typeof this.cbEndFall === "function") this.cbEndFall();
      }

      if (typeof this.cbFalling === "function") this.cbFalling();
    }, CONST.defaultInterval)
  }

  clearCanvas(c) {
    c.clearRect(
      this.position.x,
      this.position.y - this.vel,
      this.width,
      this.height,
    );
    c.fillStyle = 'black';
    c.fillRect(
      this.position.x,
      this.position.y - this.vel,
      this.width,
      this.height,
    );
  }

  draw(c) {
    if (this.isLoaded) c.drawImage(
      this.image,
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height,
    );
  }
}

export class Shot {
  constructor({ width, height, duration, color, damage, position, finalCordinates, finalSizes, vel, spaceshipData }) {
    this.width = width;
    this.height = height;
    this.duration = duration;
    this.color = color;
    this.damage = damage;
    this.position = position;
    this.finalCordinates = finalCordinates;
    this.finalSizes = finalSizes;
    this.spaceshipData = spaceshipData;
    this.vel = vel;
    this.active = false;
  }

  draw(c) {
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, 0, 2 * Math.PI);
    c.fill()
  }

  ignite(c) {
    this.active = true;
    this.position = {
      x: this.spaceshipData.position.x + this.spaceshipData.width / 2 - this.width / 2,
      y: this.spaceshipData.position.y + this.spaceshipData.height / 2,
    };

    if (this.duration) this.timeout = setTimeout(() => {
      this.active = false;
    }, this.duration);

    if (this.finalCordinates) this.moveUntilFinalCordinates();
    if (this.finalSizes) this.expandUntilFinalSize();
  }

  moveUntilFinalCordinates(finalPositionX = this.finalCordinates.x, finalPositionY = this.finalCordinates.y) {
    if (this.intervalMove) clearInterval(this.intervalMove);

    this.intervalMove = setInterval(() => {
      if (!this.active) {
        this.destroyIntervals();
        return;
      }

      if (
        finalPositionY >= this.position.y
      ) {
        this.active = false;
        clearInterval(this.intervalMove);
      }

      if (finalPositionY > this.position.y) this.position.y += this.vel;
      if (finalPositionX && finalPositionX > this.position.x) this.position.x += this.vel;
      if (finalPositionY < this.position.y) this.position.y -= this.vel;
      if (finalPositionX && finalPositionX < this.position.x) this.position.x -= this.vel;

    }, CONST.defaultInterval);

  }

  expandUntilFinalSize(c, finalWidth = this.finalSizes.width, finalHeight = this.finalSizes.height) {
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
  }
}

export class SpaceShipSprite extends Sprite {
  constructor({ damage, position, width, height, imageSrc, shotType = "default", maxPositions }) {
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
  }

  move({ top = 0, bottom = 0, right = 0, left = 0, canvasCtx }) {
    if (this.position.x + right + this.width - (this.width / 3) <= this.maxPositions.x) this.position.x += right;
    if (this.position.x - left >= 0 - (this.width / 3)) this.position.x -= left;
    if (this.position.y + bottom + (this.height /2) <= this.maxPositions.y) this.position.y += bottom;
    if (this.position.y - top >= 0 - this.height / 2) this.position.y -= top;

    if (this.isLoaded) {
      this.draw(canvasCtx);
    }
  }

  shoot(c, type) {
    const shot = ShotTypes[type || this.shotType].getSprite(this);
    shot.ignite(c);

    this.shots.push(shot);
  }
}
