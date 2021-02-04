import Particle from "./particle.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default class Main {
  constructor(width, height, analyserDataArray, bufferLength) {
    this.width = width;
    this.height = height;

    this.analyserDataArray = analyserDataArray;

    this.particles = [new Particle(this, getRandomInt(this.width), getRandomInt(this.height))];
    for (let i = 0; i < bufferLength; i++) {
      this.particles.push(
        new Particle(
          this,
          getRandomInt(this.width),
          getRandomInt(this.height),
          analyserDataArray[i]
        )
      );
    }
  }

  draw(ctx) {
    this.particles.map((x) => x.draw(ctx));
  }

  update() {
    this.particles.map((x, index) => x.update(this.analyserDataArray[index]));
  }
}
