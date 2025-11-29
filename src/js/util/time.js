// @ts-check

/** 
 * 引数のms分処理を待機する  
 * async関数の中で先頭にawaitをつける 
 * @param {number} time
 * */
export const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));


/** @type {number | null} */
let stopwatchId = null;

/**
 * @param {{ onTick: (elapsed: number) => void }} options
 */
export function startStopwatch({ onTick }) {
    if (stopwatchId) clearInterval(stopwatchId);
    const initSecond = 1;

    const startTime = performance.now() - initSecond * 1000; // sec
    onTick?.(initSecond);

    const updateInterval = 1000; // ms

    stopwatchId = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        onTick?.(elapsed);
    }, updateInterval);
}

export function stopStopwatch() {
    if (!stopwatchId) return;
    clearInterval(stopwatchId);
    stopwatchId = null;
}
