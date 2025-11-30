// @ts-check

/**
 * @typedef {import("../constants/common-types.d.js").Coordinate} Coordinate
 */

/**
 * xとyのプロパティを持つ2つのオブジェクトを比較し、完全に同じ値を持つかチェックする
 * @param {Coordinate} a 
 * @param {Coordinate} b 
 */
export function isSameCoord(a, b) {
    return a.x === b.x && a.y === b.y;
}