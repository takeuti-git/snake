/**
 * @readonly
 * @enum {string}
 */
export const GAME_STATUS = Object.freeze({
    READY: "Ready",         // 開始前
    PLAYING: "Playing",     // プレイ中
    // PAUSED: "Paused",       // 一時停止
    CLEARED: "Cleared", // クリア
    FAILED: "Failed",     // 衝突
    // ENDED: "Ended",
    // STOPPED: "stopped",     // 手動停止
});
