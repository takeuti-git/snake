// import { deepFreeze } from "../util/deep_freeze.js";

/**
 * @typedef {import("./common-types.d.js").Vector} Vector
 */

/**
 * @enum {Vector}
 */
export const DIR = Object.freeze({
    UP: Object.freeze({ vx: 0, vy: -1 }),
    DOWN: Object.freeze({ vx: 0, vy: 1 }),
    RIGHT: Object.freeze({ vx: 1, vy: 0 }),
    LEFT: Object.freeze({ vx: -1, vy: 0 }),
});