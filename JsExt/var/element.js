
(function element(Module, $valid) {
    var element = {
        acceptData: function (owner) {
            return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
        },
        merge: function (first, second) {
            var len = +second.length,
                firstLen = first.length,
                i = 0;

            for (; i < len; i++) {
                first[firstLen++] = second[i];
            }
            first.length = firstLen;
            return first;
        },
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        toArray: function (owner) {
            return Array.prototype.slice.call(owner);
        },
        get: function (owner, num) {
            if (owner == null || owner == undefined) {
                return;
            }
            if (num == null || num == undefined) {
                return Array.prototype.slice.call(owner);
            }

            return num < 0 ? owner[num + owner.length] : owner[num];
        },
        each: function (owner, callback) {
            var length, i = 0;
            if ($valid.isArrayLike(owner)) {
                length = owner.length;
                for (; i < length; i++) {
                    if (callback.call(owner[i], i, owner[i]) === false) {
                        break;
                    }
                }
            }
            else {
                for (i in owner) {
                    if (callback.call(owner[i], i, owner[i]) === false) {
                        break;
                    }
                }
            }
            return owner;
        },
        text: function (elem) {
            var node,
                ret = "",
                nodeType = elem.nodeType;
            if (!nodeType && !$valid.isArrayLike(elem)) {
                while (node = elem[i++]) {
                    ret += this.text(node);
                }
            }
            else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                }
                else {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += this.text(elem);
                    }
                }
            }
            else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            return ret;
        },
        makeArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                if ($valid.isArrayLike(Object(arr))) {
                    this.merge(ret, typeof arr === "string" ? [arr] : arr);
                }
                else {
                    push.call(ret, arr);
                }
            }
            return ret;
        },
        inArray: function (elem, arr, i) {
            return arr == null ? -1 : Array.prototype.indexOf.call(arr, elem, i);
        },

        grep: function (elems, callback, invert) {
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;
            for (; i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }
            return matches;
        },
        flat: function (elems) {
            var results = [];
            if (elems.flat && typeof elems.flat === "function") {
                return elems.flat(Infinity);
            }
            else {
                var push = function (elem, res) {
                    if (Array.isArray(elem)) {
                        var elems = elem;
                        for (var i = 0; i < elems; i++) {
                            if (!Array.isArray(elems[i])) {
                                results.push(elems[i]);
                            }
                            else {
                                push(elems[i], res);
                            }
                        }
                    }
                }
                for (var i = 0; i < elems; i++) {
                    if (!Array.isArray(elems[i])) {
                        results.push(elems[i]);
                    }
                    else {
                        push(elems[i], reuslts);
                    }
                }
            }
            return results;
        },
        map: function (elems, callback, arg) {
            var length, value,
                i = 0,
                ret = [];
            if ($valid.isArrayLike(elems)) {
                length = elems.length;
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            }
            return this.flat(ret);
        }
    }
    Module.register("element", element);

})(Module, Module.require("validate"));