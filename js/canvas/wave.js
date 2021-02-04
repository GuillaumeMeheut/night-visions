let friction = 0.99;

let playVolume = document.querySelector(".containerPlayVolume");

const pos = playVolume.getBoundingClientRect();

const position = {
  x: pos.x + pos.width / 2,
  y: pos.y + pos.height / 2,
};

export default class Wave {
  constructor(main) {
    this.mainWidth = main.width;
    this.mainHeight = main.height;

    this.main = main;

    this.size = 1;

    this.position = {
      x: position.x,
      y: position.y,
    };

    this.speed = 25;

    this.color = "rgb(101,171,159, 0.7)";
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.moveTo(
      this.position.x + this.size * Math.cos(0),
      this.position.y + this.size * Math.sin(0)
    );

    for (let side = 0; side < 7; side++) {
      ctx.lineTo(
        this.position.x + this.size * Math.cos((side * 2 * Math.PI) / 6),
        this.position.y + this.size * Math.sin((side * 2 * Math.PI) / 6)
      );
    }
    ctx.lineWidth = 8;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    this.speed *= friction;
    this.size += this.speed;
  }
}
