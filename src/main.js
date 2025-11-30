// main.js
"use strict";
import { Game } from "./core/game.js";
import { setupKeyEvents } from "./ui/event.js";

function main() {
    const option = sessionStorage.getItem("map_size");
    const [width, height] = option ? option.split(",") : [15, 15];

    const canvas = document.getElementById("canvas");
    const tileSize = 30;
    canvas.width = width * tileSize;
    canvas.height = height * tileSize;

    const game = new Game(width, height);
    game.render();

    setupKeyEvents(game);

}
main();

globalThis.setMapSize = (width, height = width) => {
    sessionStorage.setItem("map_size", `${width},${height}`);
    console.log(`set mapSize to: ${width},${height}`);
    window.location.href = "./";
};