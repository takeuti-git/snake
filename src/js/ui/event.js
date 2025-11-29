// @ts-check

import { Game } from "../core/game.js";
import { GAME_STATUS } from "../constants/game_status.js";

import { setOutBorderColor, resetOutBorderColor } from "./display.js";
import { status, setStatus } from "./status_controller.js";
import * as gameSpeed from "./speed_controller.js";
import { COLORS } from "../constants/colors.js";

/**
 * UIイベントの登録
 * @param {Game} game 
 */
export function setupKeyEvents(game) {
    setStatus(GAME_STATUS.READY);
    document.addEventListener("keydown", (e) => handleKeyDown(e, game));
    document.addEventListener("keyup", (e) => handleKeyUp(e));
}

/**
 * keydown処理
 * @param {KeyboardEvent} e 
 * @param {Game} game 
 */
function handleKeyDown(e, game) {
    if (e.repeat) return;
    if (/^F([1-9]|1[0-2])$/.test(e.key)) return;
    e.preventDefault();

    switch (status) {
        case GAME_STATUS.READY:
            if (e.code === "Space") startGame(game);
            break;

        case GAME_STATUS.PLAYING:
            handlePlayingKey(e, game);
            break;
    }
    if (e.code === "KeyR") goHome(e);
}

/**
 * @param {KeyboardEvent} e 
 * @param {Game} game 
 */
function handlePlayingKey(e, game) {
    game.handleKey(e);

    if (e.ctrlKey) {
        gameSpeed.setSlow();
        setOutBorderColor(COLORS.SLOW);
        return;
    }
    if (e.shiftKey) {
        gameSpeed.setFast();
        setOutBorderColor(COLORS.FAST);
        return;
    }

}

/**
 * @param {KeyboardEvent} e 
 */
function handleKeyUp(e) {
    if (e.key === "Shift" || e.key === "Control") {
        gameSpeed.setNormal();
        resetOutBorderColor();
        return;
    }
}

/**
 * @param {Game} game 
 */
async function startGame(game) {
    setStatus(GAME_STATUS.PLAYING);
    game.onStart();
}

/**
 * @param {KeyboardEvent} e 
 */
function goHome(e) {
    e.preventDefault();
    window.location.href = "./";
}
