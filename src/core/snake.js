// @ts-check
// snake.js

import { DIR } from "../constants/dir.js";
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
        this.direction = structuredClone(DIR.RIGHT);

        /**
         * directionを決定するための一時的なオブジェクト
         * @type {Vector[]}
         */
        this.nextDirectionQueue = [];

        /** nextDirectionQueueの最大要素数 */
        this.maxQueueLen = 2;

        this.growFlag = false;

        this.willStepOver = false;
    }

    isMapFull() {
        return this.body.length === this.mapArea;
    }

    /**
     * @param {number} vx 
     * @param {number} vy 
     */
    setnextDirection(vx, vy) {
        if (this.nextDirectionQueue.length >= this.maxQueueLen) return; // 容量越え

        const last = this.nextDirectionQueue[this.nextDirectionQueue.length - 1];
        if (last && last.vx === vx && last.vy === vy) return; // 最後と同じ入力は無し

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

    /** 
     * 新しい頭を配列の先頭に追加
     * @param {Coordinate} nextHead 
     * */
    move(nextHead) { this.body.unshift(nextHead); }

    grow() { this.growFlag = true; }
    shrink() { this.body.pop(); }
    stepOver() { this.willStepOver = true; }

    computeNextHead() {
        const head = this.body[0];
        const dir = structuredClone(this.direction);

        if (this.willStepOver) {
            this.willStepOver = false;
            dir.vx *= 2;
            dir.vy *= 2;
        }

        return { x: head.x + dir.vx, y: head.y + dir.vy };
    }

    hitwall(/** @type {Coordinate} */ nextHead) {
        return (
            nextHead.x < 0 || nextHead.x >= this.mapSize.width ||
            nextHead.y < 0 || nextHead.y >= this.mapSize.height
        );
    }

    hitSelf(/** @type {Coordinate} */ nextHead) {
        const bodyExceptTail = this.body.slice(0, -1);
        return bodyExceptTail.some(seg => isSameCoord(seg, nextHead));
    }

    willCrash(/** @type {Coordinate} */ nextHead) {
        return this.hitwall(nextHead) || this.hitSelf(nextHead);
    }

    willEat(/** @type {Coordinate} */ nextHead) {
        return this.food.some(seg => isSameCoord(seg, nextHead));
    }

    /**
     * @returns {EndReason}
     */
    update() {
        if (this.nextDirectionQueue.length) {
            this.setDirection();
        }

        /** @type {Coordinate} */
        const nextHead = this.computeNextHead();

        if (this.willCrash(nextHead)) {
            return END_REASONS.CRASH;
        }

        // 前進
        this.move(nextHead);

        // 食べ物を判定
        const eating = this.willEat(nextHead);

        if (this.growFlag || eating) {
            // do nothing
            // growメソッドにより成長するのではなく、shrinkをするかしないか
        } else {
            this.shrink();
        }
        this.growFlag = false;

        // 食べ物が食べられた時だけ新しく生成。
        if (eating) {
            this.spawnFood(nextHead);
        }

        // bodyセグメントの数がマップのタイルと等しいとき、ゲームを終了する
        if (this.isMapFull()) {
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

        /** @type {Coordinate[]} */
        let emptyCells = [];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // bodyと被らない座標を取得
                const xy = { x, y };
                const occupied =
                    this.body.some(seg => isSameCoord(seg, xy)) ||
                    this.food.some(seg => isSameCoord(seg, xy));
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

        // // 追加ボーナス 確率で食べ物の総数が増加する
        // const p = 1 + this.food.length;
        // const rng = Math.floor(Math.random() * p);
        // if (rng === 0) {
        //     addFood();
        // }
    }
}