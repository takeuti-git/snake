const mapForObj = f => a =>
    Object.keys(a).reduce((acc, e) => ({ ...acc, [e]: f(a[e]) }), {});
const isObj = a => Object.prototype.toString.call(a) === "[object Object]";

export const deepFreeze = a =>
    Array.isArray(a) ? Object.freeze(a.map(deepFreeze))
        : isObj(a) ? Object.freeze(mapForObj(deepFreeze)(a))
            : Object.freeze(a);