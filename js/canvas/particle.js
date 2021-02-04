import Wave from "./wave.js";

export default class Particle {
  constructor(main, x, y, dataSound) {
    this.mainWidth = main.width;
    this.mainHeight = main.height;

    this.main = main;

    this.radius = 3;
    this.wave = undefined;

    this.position = {
      x: x,
      y: y,
    };

    this.color = "#65ab9f";
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.shadowBlur = 30;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.closePath();
    if (this.wave !== undefined) this.wave.draw(ctx);
  }

  update(data) {
    this.radius = data / 12;
    if (data >= 0 && data <= 48) this.color = "#6398B8";
    if (data >= 48 && data <= 96) this.color = "#69B8C2";
    if (data >= 96 && data <= 144) this.color = "#65ab9f";
    if (data >= 144 && data <= 192) this.color = "#69C29A";
    if (data >= 250 && this.wave === undefined) {
      console.log("proc");
      this.wave = new Wave(this.main);
      setTimeout(() => {
        delete this.wave;
      }, 2000);
    }
    if (this.wave !== undefined) {
      this.wave.update();
    }
  }
}
