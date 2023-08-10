export class Sprite {
  constructor({ position, imageSrc, width, height }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = new Image(width, height);
    this.image.src = imageSrc;
    this.imageSrc = imageSrc;
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

  clearCanvas(c) {
    c.clearRect(
      this.position.x,
      this.position.y - this.vel,
      this.image.width,
      this.image.height,
    );
    c.fillStyle = 'black';
    c.fillRect(
      this.position.x,
      this.position.y - this.vel,
      this.image.width,
      this.image.height,
    );
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

export class SpaceShipSprite extends Sprite {
  constructor({
    damage,
    position,
    width,
    height,
    imageSrc,
  }) {
    super({
      position,
      width,
      height,
      imageSrc,
    });

    this.damage = damage;
    this.isAnimating = false;
    this.image.onload = () => {
      this.isLoaded = true;
    };
  }

  draw(c) {
    if(this.isLoaded) c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height,
    );
  }

  move({ top = 0, bottom = 0, right = 0, left = 0, canvasCtx }) {
    this.position.x += right;
    this.position.x -= left;
    this.position.y += bottom;
    this.position.y -= top;

    this.draw(canvasCtx);
  }
}
