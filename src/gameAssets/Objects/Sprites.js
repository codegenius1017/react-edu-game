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
    this.isAnimating = false;
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  fall({ cbFalling, cbEndFall, canvasCtx, gameScreenWidth, gameScreenHeight }) {
    if (this.isAnimating) return; // Evita iniciar uma nova animação se já estiver em andamento

    this.isAnimating = true;

    if (this.isLoaded) {
      // this.clearCanvas(canvasCtx, gameScreenWidth, gameScreenHeight);
      this.draw(canvasCtx);
    }

    const animate = () => {
      this.position.y += this.vel;

      if (this.isLoaded) {
        // this.clearCanvas(canvasCtx, gameScreenWidth, gameScreenHeight);
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

  clearCanvas(c, cWidth, cHeigth) {
    c.clearRect(
      this.position.x,
      (this.position.y - this.vel),
      this.width,
      this.height
    );
    c.fillStyle = 'black';
    c.fillRect(0, 0, cWidth, cHeigth);
  }

  draw(c) {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height,
    );
  }
}
