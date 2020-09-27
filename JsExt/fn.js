
//#region jsDom 对象 定义
jsDom.fn = {
    version: "jsDom 1.0.0",
    constructor: jsDom,
    isArrayLike: function (obj) {

        var length = !!obj && obj.length;

        return Array.isArray(obj) || typeof length === "number" && length > 0 && (length - 1) in obj;
    },
    isPlainObject: function (obj) {
        var proto, Ctor;

        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }

        proto = Object.getPrototypeOf(obj);

        if (!proto) {
            return true;
        }

        Ctor = proto.hasOwnProperty("constructor") && proto.constructor;
        return typeof Ctor === "function" && Ctor.toString() === Object.toString();
    },
    isEmptyObject: function (obj) {
        var name;

        for (name in obj) {
            return false;
        }
        return true;
    },
    isFunction: function (fn) {
        return typeof fn === "function" && typeof fn.nodeType !== "number";
    },
    merge: function (dest, src) {
        var len = +src.length,
            j = 0,
            i = dest.length;

        for (; j < len; j++) {
            dest[i++] = src[j];
        }

        dest.length = i;
        return dest;
    },
    toArray: function (obj) {
        return Array.prototype.slice.call(obj);
    },
    each: function (obj, callback) {
        var length, i = 0;

        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }

        return obj;
    },
    deepCopy: function (target, src) {
        var srcValue, isCopyArray, targetProp;
        if (typeof target !== "object" && typeof target !== "function") {
            target = {};
        }

        if (src) {
            for (name in src) {
                isCopyArray = false;
                srcValue = src[name];
                targetProp = target[name];

                // Prevent Object.prototype pollution & never-ending loop 保护prototype不被污染和不能结束的循环
                if (name === "__proto__" || target === srcValue) {
                    continue;
                }

                if (isPlainObject(srcValue) || (isCopyArray = Array.isArray(srcValue))) {
                    if (isCopyArray && !isArray(targetProp)) {
                        targetProp = [];
                    } else if (!isCopyArray && !isPlainObject(targetProp)) {
                        targetProp = {};
                    }
                    target[name] = deepCopy(targetProp, srcValue);
                }
                else if (srcValue !== undefined) {
                    target[name] = srcValue;
                }
            }
        }
        return target;
    },
    extend: function () {
        var length = arguments.length;
        var target = this;

        for (i in arguments) {
            target = jsDom.prototype.deepCopy(this, arguments[i]);
        }

        return target;
    }
};