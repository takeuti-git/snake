// @ts-check
// snake.js

import { END_REASONS } from "../constants/end_reason.js";
import { isSameCoord } from "../util/coord.js";

/**
 * @typedef {import("../constants/common-types.d.js").Coordinate} Coordinate
 * @typedef {import("../constants/common-types.d.js").Vector} Vector
 * @typedef {import("../constants/common-types.d.js").EndReason} EndReason
 */

export class Snake {
    /**
     * @param {number} mapWidth 
     * @param {number} mapHeight 
     */
    constructor(mapWidth, mapHeight) {
        this.mapSize = { width: mapWidth, height: mapHeight };
        this.mapArea = this.mapSize.width * this.mapSize.height;

        // 頭と食べ物の初期位置を決定する。中心から均等にずれた位置
        const centerX = Math.floor(mapWidth * 0.5);
        const centerY = mapHeight % 2 === 0 ? Math.floor(mapHeight / 2) - 1 : Math.floor(mapHeight / 2);

        const d = mapWidth <= 3 ? 1 : mapWidth === 5 ? 1 : 2;
        const leftX = centerX - d;
        const rightX = mapWidth % 2 === 0 ? centerX + d - 1 : centerX + d;

        /**
         * スネークの座標配列
         * - i=0はスネークの頭を表す
         *  @type {Coordinate[]} */
        this.body = [
            { x: leftX, y: centerY },
            { x: leftX - 1, y: centerY },
            { x: leftX - 2, y: centerY },
        ];

        /**
         * 食べ物の座標配列
         * @type {Coordinate[]}
         */
        this.food = [
            { x: rightX, y: centerY },
        ];

        /** 
         * 進行方向  
         * デフォルトは右
         * @type {Vector}
         */
        this.direction = { vx: 1, vy: 0 };

        /**
         * directionを決定するための一時的なオブジェクト
         * @type {Vector[]}
         */
        this.nextDirectionQueue = [];

        /** nextDirectionQueueの最大要素数 */
        this.maxQueueLen = 2;

        this.growFlag = false;
    }

    /**
     * @param {number} vx 
     * @param {number} vy 
     */
    setnextDirection(vx, vy) {
        if (this.nextDirectionQueue.length >= this.maxQueueLen) return; // 容量越え

        const last = this.nextDirectionQueue[this.nextDirectionQueue.length - 1];
        if (last && last.vx === vx && last.vy === vy) return; // 最後と同じ入力は無し

        if (this.direction.vx === vx && this.direction.vy === vy) return; // 現在の方向と同じなら無視

        const entry = { vx, vy };
        this.nextDirectionQueue.push(entry);
    }

    setDirection() {
        if (this.nextDirectionQueue.length === 0) return;

        const { vx, vy } = this.nextDirectionQueue[0];

        // 単項マイナス演算子により符号を反転する。
        // 新しい方向と反転された今の方向を比較。
        const isOpposite =
            vx === -this.direction.vx &&
            vy === -this.direction.vy;

        // 入力が進行方向の反対でないときだけベクトルを変更する。
        if (!isOpposite) {
            this.direction = { vx, vy };
        }

        this.nextDirectionQueue.shift(); // キューの先頭要素を削除
    }

    isMapFull() {
        return this.body.length === this.mapArea;
    }

    /** 
     * 新しい頭を配列の先頭に追加
     * @param {Coordinate} newHead 
     * */
    forward(newHead) {
        this.body.unshift(newHead);
    }

    grow() { this.growFlag = true; }
    shrink() { this.body.pop(); }

    onEnd() {
        // this.food = [];
    }

    /**
     * @returns {EndReason}
     */
    update() {
        if (this.nextDirectionQueue.length) {
            this.setDirection();
        }

        // ヘビの頭を取得。
        const head = this.body[0];

        // 新しい頭の位置を計算。今の頭の位置にベクトルを足した座標が次の位置になる。
        /** @type {Coordinate} */
        const newHead = {
            x: head.x + this.direction.vx,
            y: head.y + this.direction.vy,
        };

        // 衝突判定は移動してから（newHeadが生まれてから）
        const hitWall =
            newHead.x < 0 || newHead.x >= this.mapSize.width ||
            newHead.y < 0 || newHead.y >= this.mapSize.height;
        if (hitWall) {
            this.onEnd();
            return END_REASONS.CRASH;
        }

        const bodyExceptTail = this.body.slice(0, -1);
        const hitSelf = bodyExceptTail.some(seg => isSameCoord(seg, newHead));
        if (hitSelf) {
            this.onEnd();
            return END_REASONS.CRASH;
        }

        // 前進
        this.forward(newHead);

        // 食べ物を判定
        const ateFood = this.food.some(seg => isSameCoord(seg, newHead));
        if (this.growFlag || ateFood) {
            // do nothing
        } else {
            this.shrink();
        }
        this.growFlag = false;

        // 食べ物が食べられた時だけ新しく生成。
        if (ateFood) {
            this.spawnFood(newHead);
        }

        // bodyセグメントの数がマップのタイルと等しいとき、ゲームを終了する
        if (this.isMapFull()) {
            this.onEnd();
            return END_REASONS.COMPLETE;
        }

        return END_REASONS.CONTINUE; // ゲーム続行
    }

    /** @param {Coordinate} head */
    spawnFood(head) {
        if (this.isMapFull()) return;

        // headと一致するfoodを削除
        this.food = this.food.filter(seg => !isSameCoord(seg, head));

        const { width, height } = this.mapSize;
        const body = this.body;
        const food = this.food;

        /** @type {Coordinate[]} */
        let emptyCells = [];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // bodyと被らない座標を取得
                const xy = { x, y };
                const occupied =
                    body.some(seg => isSameCoord(seg, xy)) ||
                    food.some(seg => isSameCoord(seg, xy));
                if (!occupied) emptyCells.push(xy);
            }
        }
        if (emptyCells.length === 0) return;

        const addFood = () => {
            if (emptyCells.length === 0) return;

            const rng = Math.floor(Math.random() * emptyCells.length);
            const pos = emptyCells[rng];

            // foodに追加
            this.food.push(pos);

            // 追加したfoodをemptyCellsから削除
            emptyCells = emptyCells.filter(seg => !isSameCoord(seg, emptyCells[rng]));
        };

        // 食べられたら必ず1個追加
        addFood();

        // // 追加ボーナス 確率で食べ物の数が増加する
        // const p = 1 + this.food.length;
        // const rng = Math.floor(Math.random() * p);
        // if (rng === 0) {
        //     addFood();
        // }
    }
}