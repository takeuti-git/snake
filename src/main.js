// @ts-check

"use strict";
import { Game } from "./core/game.js";
import { setupKeyEvents } from "./ui/event.js";

function main() {
    const option = sessionStorage.getItem("map_size");

    const tmp = option ? option.split(",").map(Number) : [15 ,15];
    const width = tmp[0];
    const height = tmp[1];

    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
    const tileSize = 30;
    canvas.width = width * tileSize;
    canvas.height = height * tileSize;

    const game = new Game(width, height);
    game.render();

    setupKeyEvents(game);

}

/**
 * @param {number} width 
 * @param {number} height 
 */
globalThis.setMapSize = (width, height = width) => {
    sessionStorage.setItem("map_size", `${width},${height}`);
    console.log(`set mapSize to: ${width},${height}`);
    window.location.href = "./";
};

document.addEventListener("DOMContentLoaded", main);