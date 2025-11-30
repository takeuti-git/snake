// @ts-check

const score = document.getElementById("score");
const status = document.getElementById("status");

const canvas = document.getElementById("canvas");

const time = document.getElementById("time");

/** @param {number} value */
export function updateScoreDisplay(value) {
    if (!score) return;
    score.textContent = value.toString();
}

/** @param {string} value */
export function updateStatusDisplay(value) {
    if (!status) return;
    status.textContent = value;
}

/** @param {string} value */
export function setOutBorderColor(value) {
    if (!canvas) return;
    canvas.style.borderColor = value;
}

export function resetOutBorderColor() {
    if (!canvas) return;
    canvas.style.borderColor = "";
}

/** @param {number} value */
export function updateTimeDisplay(value) {
    if (!time) return;

    const min = Math.floor(value / 60).toString().padStart(2, "0");
    const sec = (value % 60).toFixed(0).padStart(2, "0");

    time.textContent = `${min}:${sec}`;
}