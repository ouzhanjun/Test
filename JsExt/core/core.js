
(function Core(Module, $elem) {

    var Core = function () {
        this.length = 0;
        this.toArray = function () {
            return $elem.toArray(this);
        }
        this.get = function (num) {
            return $elem.get(this, num);
        }
        this.pushStack = function (elems) {
            var ret = $elem.merge(new Core(), elems);
            ret.prevObject = this;
            return ret;
        }
        this.each = function (callback) {
            return $elem.each(this, callback);
        }
        this.map = function (callback) {
            return this.pushStack($elem.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        }
        this.slice = function () {
            return this.pushStack(Array.prototype.slice.apply(this, arguments));
        }
        this.eq = function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        }
        this.first = function () {
            return this.eq(0);
        }
        this.last = function () {
            return this.eq(-1);
        }
        this.even = function () {
            return this.pushStack($elem.grep(this, function (elem, i) {
                return (i + 1) % 2;
            }));
        }
        this.odd = function () {
            return this.pushStack($elem.grep(this, function (elem, i) {
                return i % 2;
            }));
        }
        this.end = function () {
            return this.prevObject || this;
        }
        this.deepCopy = function (target, src) {
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

                    if (validate.isPlainObject(srcValue) || (isCopyArray = Array.isArray(srcValue))) {
                        if (isCopyArray && !Array.isArray(targetProp)) {
                            targetProp = [];
                        } else if (!isCopyArray && !validate.isPlainObject(targetProp)) {
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
        }
    }

    Module.register("core", Core);

})(Module, Module.require("element"));