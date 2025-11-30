// @ts-check

import { COLORS } from "../constants/colors.js";
import { generateGradient } from "../util/generate_gradient.js";
import * as time from "../util/time.js";

/**
 * @typedef {import("../constants/common-types.d.js").Coordinate} Coordinate
 * @typedef {import("../constants/common-types.d.js").Vector} Vector
 */

const tileSize = 30;
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas")); // 括弧で囲むことでアサーションを行う
if (!canvas) throw new Error("failed to get canvas element");

const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

/**
 * 矩形を描く基本的な処理を提供する
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 * @param {string} color 
 */
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

/**
 * 座標に1タイル分の色を描く
 * @param {number} x 
 * @param {number} y 
 * @param {string} color 
 */
function drawTile(x, y, color) {
    const w = tileSize;
    const h = tileSize;
    drawRect(x, y, w, h, color);
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 */
function getBackgroundColor(x, y) {
    return (x + y) % 2 === 0 ? "#fff" : "#eee"; // 背景タイルの模様を決定する
}

export function clear() {
    const max_width = Math.floor(canvas.width / tileSize);
    const max_height = Math.floor(canvas.height / tileSize);

    for (let i = 0; i < max_width; i++) {
        for (let j = 0; j < max_height; j++) {
            const color = getBackgroundColor(i, j);
            const x = i * tileSize;
            const y = j * tileSize;
            drawTile(x, y, color);
        }
    }
}

/**
 * スネークの頭から尾までを描く、目は描かない
 * @param {Coordinate[]} segments 
 * @param {string} headColor 
 */
export function drawSnakeBody(segments, headColor) {
    const gradient = generateGradient(
        headColor,
        { r: 0, g: 1, b: 0 },
        segments.length
    );

    segments.forEach((seg, index) => {
        const tile = { x: seg.x * tileSize, y: seg.y * tileSize };
        drawTile(tile.x, tile.y, gradient[index]);
    });
}

/** 
 * @param {Coordinate} headSegment 
 * @param {Vector} direction 
 */
export function drawSnakeEye(headSegment, direction) {
    const eyeSize = tileSize / 3;
    const x = headSegment.x * tileSize + (eyeSize) + direction.vx * 8;
    const y = headSegment.y * tileSize + (eyeSize) + direction.vy * 8;
    const w = eyeSize;
    const h = eyeSize;
    drawRect(x, y, w, h, COLORS.SNAKE_EYE)
}

/**
 * @param {Coordinate[]} food 
 * @param {string} foodColor 
 */
export function drawFood(food, foodColor) {
    food.forEach((seg) => {
        const tile = { x: seg.x * tileSize, y: seg.y * tileSize };
        drawTile(tile.x, tile.y, foodColor);
    });
}

/** 
 * @param {Coordinate[]} segments 
 * @param {string} clearColor
 */
export async function eraseSnake(segments, clearColor) {
    for (const [index, seg] of segments.entries()) {
        const tile = { x: seg.x * tileSize, y: seg.y * tileSize };
        drawTile(tile.x, tile.y, clearColor);

        const ms = Math.max(20, 80 - (index * 2));
        await time.sleep(ms);
        setTimeout(() => {
            const color = getBackgroundColor(seg.x, seg.y);
            drawTile(tile.x, tile.y, color);
        }, 80);
    }
}