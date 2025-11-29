// game.js
// @ts-check

import { Snake } from "./snake.js";
import { resetOutBorderColor, updateScoreDisplay, updateTimeDisplay } from "../ui/display.js";
import { setStatus } from "../ui/status_controller.js";
import { getTickMs } from "../ui/speed_controller.js";
import * as time from "../util/time.js";
import { GAME_STATUS } from "../constants/game_status.js";
import { END_REASONS } from "../constants/end_reason.js";
import { DIR } from "../constants/dir.js";
import { COLORS } from "../constants/colors.js";
import * as view from "../ui/display_canvas.js"

/**
 * @typedef {import("../constants/common-types.d.js").Vector} Vector
 * @typedef {import("../constants/common-types.d.js").EndReason} EndReason
 * @typedef {import("../constants/common-types.d.js").Colors} Colors
 */

/** @type {Record<string, Vector>} */
const KEY_TO_DIR = {
    ArrowUp: DIR.UP,
    KeyW: DIR.UP,
    ArrowDown: DIR.DOWN,
    KeyS: DIR.DOWN,
    ArrowRight: DIR.RIGHT,
    KeyD: DIR.RIGHT,
    ArrowLeft: DIR.LEFT,
    KeyA: DIR.LEFT,
};

export class Game {
    /**
     * - マップのサイズを指定する
     * - 第2引数を省略すると第1引数と同じ値が代入される
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height = width) {
        this.mapSize = { width: Math.max(2, Math.trunc(width)), height: Math.max(2, Math.trunc(height)) };
        this.mapArea = this.mapSize.width * this.mapSize.height;

        this.snake = new Snake(this.mapSize.width, this.mapSize.height);

        this.isRunning = true;

        /** 方向変更以外の操作キー 
         * @type {Record<string, () => void>}
         */
        this.specialKeys = {
            KeyG: () => { this.snake.grow(); console.log(11) }, // デバッグ用
        };
    }

    /** @param {KeyboardEvent} e */
    handleKey(e) {
        const code = e.code;
        const dir = KEY_TO_DIR[code];
        if (dir) {
            this.snake.setnextDirection(dir.vx, dir.vy);
            return;
        }
        // 移動キーのどれにも当てはまらなかったら特殊キーのマップを走査
        this.specialKeys[code]?.();
    }

    /** ゲームを1フレーム進める */
    tick() {
        const reason = this.snake.update();
        this.render();

        if (reason !== END_REASONS.CONTINUE) {
            this.isRunning = false;
            this.onFinish(reason);
        }
    }

    render() {
        this.clearTiles(); // 最初にすべてのタイルを初期化する
        this.renderSnakeBody();
        this.renderSnakeEye();
        this.renderFood();

        updateScoreDisplay(this.snake.body.length);
    }

    clearTiles() {
        view.clear();
    }

    renderSnakeBody() {
        view.drawSnakeBody(this.snake.body, COLORS.SNAKE_HEAD);
    }

    renderSnakeEye() {
        view.drawSnakeEye(this.snake.body[0], this.snake.direction);
    }

    renderFood() {
        view.drawFood(this.snake.food, COLORS.FOOD)
    }

    onStart() {
        time.startStopwatch({
            onTick: (elapsed) => { updateTimeDisplay(elapsed); },
        });

        (async () => {
            while (this.isRunning) {
                this.tick();
                await time.sleep(getTickMs());
            }
        })();
    }

    /**
     * @param {EndReason} reason 
     */
    onFinish(reason) {
        time.stopStopwatch();
        resetOutBorderColor();

        // status-ui更新
        if (this.snake.isMapFull()) setStatus(GAME_STATUS.CLEARED);
        else setStatus(GAME_STATUS.FAILED);

        const color = reason === END_REASONS.COMPLETE ? COLORS.COMPLETE : COLORS.CRASHED;

        view.eraseSnake(this.snake.body, color);
    }
}