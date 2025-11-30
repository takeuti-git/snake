/**
 * 二次元座標
 * @typedef {object} Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * 移動ベクトル
 * @typedef {object} Vector
 * @property {number} vx
 * @property {number} vy
 */

import { END_REASONS } from "./end_reason.js";
/**
 * @typedef {typeof END_REASONS[keyof typeof END_REASONS]} EndReason
 */

import { COLORS } from "./colors.js";
/** 
 * @typedef {typeof COLORS[keyof typeof COLORS]} Colors 
 * */

export { };