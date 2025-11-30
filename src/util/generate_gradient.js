// @ts-check

/**
 * generateGradient(hex, vector, count)
 * - hex: "#rrggbb" または "#rgb" (先頭 # 必須)
 * - vector: { r: number, g: number, b: number } 各要素は -1..+1（省略は 0 と扱う）  
 *   - 正: そのチャンネルを 255 側に強める。
 *   - 負: 0 側に弱める。
 * - count: 出力個数（整数 >= 1）
 * returns: HEX の配列（長さ count）
 * @param {string} hex
 * @param {{r?: number, g?: number, b?: number}} vector
 * @param {number} count
 * @returns {string[]}
 */
export function generateGradient(hex, vector, count) {
    if (count <= 0) throw new Error("count must be >= 1");

    /**
     * HEX文字列 -> RGB配列
     * @param {string} h 
     * @returns {[number, number, number]}
     */
    function hexToRgb(h) {
        h = h.replace(/^#/, "");
        if (h.length === 3) h = h.split("").map(c => c + c).join("");
        if (h.length !== 6) throw new Error("invalid hex");

        return [
            parseInt(h.slice(0,2), 16),
            parseInt(h.slice(2,4), 16),
            parseInt(h.slice(4,6), 16),
        ];
    }

    /** 
     * RGB配列 -> HEX文字列
     * @param {[number, number, number]} rgb
     * @returns {string}
     */
    function rgbToHex([r, g, b]) {
        /** @type {(n: number) => string} */
        const pad = n => n.toString(16).padStart(2, "0");
        return `#${pad(r)}${pad(g)}${pad(b)}`;
    }
    /**
     * 値をa..bの範囲に丸める
     * @param {number} v 
     * @param {number} [a=0]
     * @param {number} [b=255]
     */
    function clamp(v, a = 0, b = 255) {
        return Math.max(a, Math.min(b, Math.round(v)));
    }

    const start = hexToRgb(hex);

    // 省略された値(undefinedになるプロパティ)をゼロとして扱うためのヌル値合体演算子(Nullish coalescing operator)
    /** @type {Record<'r'|'g'|'b', number>} */
    const vec = {
        r: vector.r ?? 0,
        g: vector.g ?? 0,
        b: vector.b ?? 0,
    };

    /** @type {("r"|"g"|"b")[]} */
    const keys = ["r", "g", "b"];

    // 各チャンネルの「最終値（final）」をベクトルの大きさに応じて決める
    /** @type {number[]} */
    const finals = keys.map((k, idx) => {
        /** @type {number} */
        const v = Math.max(-1, Math.min(1, Number(vec[k] || 0)));
        const s = start[idx];
        if (v > 0) return s + v * (255 - s);
        return s + v * (s - 0);
    });

    /** @type {string[]} */
    const out = [];

    for (let i = 0; i < count; i++) {
        const t = (count === 1) ? 0 : (i / (count - 1)); // 0..1

        const rgb = /** @type {[number, number, number]} */([
            clamp(start[0] + (finals[0] - start[0]) * t),
            clamp(start[1] + (finals[1] - start[1]) * t),
            clamp(start[2] + (finals[2] - start[2]) * t),
        ]);
        out.push(rgbToHex(rgb));
    }
    return out;
}