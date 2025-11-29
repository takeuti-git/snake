// @ts-check

import { GAME_STATUS } from "../constants/game_status.js";
import { updateStatusDisplay } from "./display.js";

/** @typedef {typeof GAME_STATUS[keyof typeof GAME_STATUS]} Status */

/** @type {Status} */
export let status = GAME_STATUS.READY;

/** @param {Status} value */
export function setStatus(value) {
    status = value;
    updateStatusDisplay(status);
}