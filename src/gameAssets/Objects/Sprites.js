export class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    width,
    height,
  }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
}

export class AsteroidSprite extends Sprite {
  constructor({
    vel,
    damage,
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    width,
    height,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      width,
    height,
    });

    this.vel = vel;
    this.damage = damage;
  }

  fall(){
    this.interval = setInterval(() => {
      this.position.y += this.vel;
    }, 50);
  }
}
