
//#region jsDom 对象 定义
jsDom.fn = {
    version: "jsDom 1.0.0",
    constructor: jsDom,
    merge: function (dest, src) {
        var len = +src.length,
			j = 0,
			i = dest.length;

		for ( ; j < len; j++ ) {
			dest[ i++ ] = src[ j ];
		}

		dest.length = i;

		return dest;
    },
    toArray: function (obj) {
        return Array.prototype.slice.call(obj);
    },
    each: function (callback) {
        jsDom.each(this, callback);
    },
    eq: function (i) {
        var j = i < 0 ? this.length + i : i;
        return this.AddElems((j < this.length && j >= 0) ? [this[j]] : []);
    },
    odd: function () {
        return this.AddElems(jsDom.where(this, function (elem, i) {
            return i % 2 == 0;
        }));
    },
    even: function () {
        return this.AddElems(jsDom.where(this, function (elem, i) {
            return i % 2 != 0;
        }));
    },
    first: function () {
        if (this.length > 0) {
            return this.eq(0);
        }
    },
    last: function () {
        if (this.length > 0) {
            return this.eq(this.length - 1);
        }
    },
    getElem: function (i) {
        var j = i < 0 ? this.length + i : i;
        return this[j];
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

                if (jsDom.validate.isPlainObject(srcValue) || (isCopyArray = Array.isArray(srcValue))) {
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
    },
};