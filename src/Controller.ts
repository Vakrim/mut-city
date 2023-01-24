import Game from "./Game";

export class Controller {
  constructor(private game: Game) {}

  init() {
    this.addInspect();
    this.addTimeCompression();
  }

  private addTimeCompression() {
    document.addEventListener('keydown', (event) => {
      if(event.key === 'f') {
        this.game.timeCompression = !this.game.timeCompression;
      }
    })
  }

  private addInspect() {
    this.game.canvas.addEventListener("click", (event) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const inspected = this.game.objects.find((object) => {
        return (
          object.position.x * 10 <= x &&
          x <= object.position.x * 10 + 10 &&
          object.position.y * 10 <= y &&
          y <= object.position.y * 10 + 10
        );
      });

      console.dir(inspected);
    });
  }
}
