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
    this.image = new Image(width, height);
    this.image.src = imageSrc;
    this.imageSrc = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw(c) {
    this.image.src = this.imageSrc;

    this.image.onload = () => {
      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax), //The x coordinate where to start clipping
        0, //The y coordinate where to start clipping
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      )
    }
  }

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update(c) {
    this.draw(c)
    this.animateFrames()
  }
}

export class SpaceShip extends Sprite {

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
      imageSrc
    });

    this.vel = vel;
    this.damage = damage;
  }

  fall(cb, c) {
    this.interval = setInterval(() => {
      this.position.y += this.vel;
      
      function animate() {
        requestAnimationFrame(animate);
        c.fillStyle = "black";
        c.fillRect(0, 0, 1000, 1000);
        if(this.draw) this.draw(c);
      }

      animate();
      cb();
    }, 50);
  }

  draw(c) {
    this.image.src = this.imageSrc;

    this.image.onload = () => {
      c.drawImage(
        this.image,
        this.position.x, //The x coordinate where to start clipping
        this.position.y, //The y coordinate where to start clipping
        this.image.width, //The width of the clipped image
        this.image.height, //The height of the clipped image
      )
    }
  }
}
