import { Controller } from './Controller';
import Game from './Game';

const game = new Game();

const controller = new Controller(game);

game.run();
controller.init();
