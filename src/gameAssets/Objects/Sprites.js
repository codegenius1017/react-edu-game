import { cloneDeep } from "lodash";
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
  constructor({
    vel,
    damage,
    position,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    width,
    height,
    imageSrc,
  }) {
    super({
      position,
      scale,
      framesMax,
      offset,
      width,
      height,
      imageSrc,
    });

    this.vel = vel;
    this.damage = damage;
    this.isAnimating = false;
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  fall({ cbFalling, cbEndFall, canvasCtx, gameScreenWidth, gameScreenHeight }) {
    if (this.isAnimating) return; // Evita iniciar uma nova animação se já estiver em andamento

    this.isAnimating = true;

    const animate = () => {
      this.position.y += this.vel;

      if (this.isLoaded) {
        this.draw(canvasCtx);
      }

      if (this.position.y < gameScreenHeight) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        cbEndFall();
      }

      cbFalling();
    };

    animate();
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
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
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
    c.arc(this.position.x, this.position.y, this.width, 0,  2 * Math.PI);
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fill()
  }

  ignite(c) {
    this.active = true;
    this.position = {
      x: this.spaceshipData.position.x + this.spaceshipData.width / 2 - this.width / 2,
      y: this.spaceshipData.position.y + this.spaceshipData.height / 2,
    };
    this.draw(c);

    if (this.duration) this.timeout = setTimeout(() => {
      this.active = false;
    }, this.duration);

    if (this.finalCordinates) this.moveUntilFinalCordinates(c);
    if (this.finalSizes) this.expandUntilFinalSize(c);
  }

  moveUntilFinalCordinates(c, finalPositionX = this.finalCordinates.x, finalPositionY = this.finalCordinates.y) {
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

      this.draw(c);
    }, CONST.defaultInterval);

  }

  expandUntilFinalSize(c, finalWidth = this.finalSizes.width, finalHeight = this.finalSizes.height) {
    if (this.intervalExpand) clearInterval(this.intervalExpand);

    this.intervalExpand = setInterval(() => {
      // if (!this.active) {
      //   this.destroyIntervals();
      //   return;
      // }

      // if (finalWidth === this.width &&
      //   finalHeight === this.height
      // ) clearInterval(this.intervalMove);

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
  constructor({ damage, position, width, height, imageSrc, shotType = "default" }) {
    super({
      position,
      width,
      height,
      imageSrc,
    });

    this.damage = damage;
    this.isAnimating = false;
    this.shots = [];
    this.shotType = shotType
  }

  move({ top = 0, bottom = 0, right = 0, left = 0, canvasCtx }) {
    this.position.x += right;
    this.position.x -= left;
    this.position.y += bottom;
    this.position.y -= top;

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
