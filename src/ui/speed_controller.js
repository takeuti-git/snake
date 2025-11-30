// @ts-check

const DEFAULT_TICK_MS = 150;

/**
 * @typedef {object} TickState
 * @property {number} ms
 * @property {number} multiplier
 */
let tickState = {
    base: DEFAULT_TICK_MS,
    multiplier: 1, // 通常速度
};

/** @param {number} n */
export function setSpeedMultiplier(n) {
    tickState.multiplier = n;
}

export function getTickMs() {
    return tickState.base * tickState.multiplier;
}

export function setFast() { setSpeedMultiplier(0.5); }
export function setNormal() { setSpeedMultiplier(1); }
export function setSlow() { setSpeedMultiplier(1.5); }
