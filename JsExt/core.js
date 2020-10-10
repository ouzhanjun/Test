
// Define a local copy of jsDom
var jsDom = function (selector, context) {
	return new jsDom.fn.init(selector, context);
};

//#region jsDom 对象定义
jsDom.fn = jsDom.prototype = {
	version: "jsDom 1.0.0",
	constructor: jsDom,
	length: 0,

	toArray: function () {
		return Array.prototype.slice.call(this);
	},
	get: function (index) {
		if (!index && index !== 0) {
			return Array.prototype.slice.call(this);
		}
		return index < 0 ? this[index + this.length] : this[index];
	},
	pushStack: function (elems) {
		var ret = jsDom.merge(this.constructor(), elems);
		ret["prevObject"] = this;
		return ret;
	},
	each: function (callback) {
		return jsDom.each(this, callback);
	},
	map: function (callback) {
		var arr = this.toArray();
		var elems = arr.map(callback);
		return this.pushStack(elems);
	},
	slice: function () {
		return this.pushStack(Array.slice.apply(this.arguments));
	},
	first: function () {
		return this.eq(0);
	},
	last: function () {
		return this.eq(-1);
	},
	even: function () {
		return this.pushStack(jsDom.grep(this, function (_elem, i) {
			return (i + 1) % 2;
		}));
	},
	odd: function () {
		return this.pushStack(jsDom.grep(this, function (_elem, i) {
			return i % 2;
		}));
	},
	eq: function (i) {
		var len = this.length,
			j = +i + (i < 0 ? len : 0);//+i 字符串格式的i转换成数值类型
		return this.pushStack(j >= 0 && j < len ? [this[j]] : [])
	},
	extend: function () {
		var length = arguments.length;
		var target = this;

		for (i in arguments) {
			target = jsDom.deepCopy(target, arguments[i]);
		}

		return target;
	}
};
//#endregion

jsDom.extend=jsDom.fn.extend;
jsDom.extend( {
	guid: 1,

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

				if (jsDom.isPlainObject(srcValue) || (isCopyArray = jsDom.isArray(srcValue))) {
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

	merge: function (first, second) {
		var len = +second.length,
			firstLen = first.length,
			i = 0;

		for (; i < len; i++) {
			first[firstLen++] = second[i];
		}
		first.length = firstLen;
	},

	grep: function (elems, callback, callbackExpect) {
		var matches = [];
		var length = elems.length;

		for (var i = 0; i < length; i++) {
			if (callback(elems[i], i) === callbackExpect) {
				matches.push(elems[i]);
			}
		}

		return matches;
	},

	each: function (obj, callback) {
		//如果是基本类型或者函数则可以直接赋值，如果是对象或数组则进行回归
		var length, i = 0;

		if (jsDom.isArrayLike(obj)) {
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
	}
});

var types = ["Boolean", "Number", "String", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
for (var i in types) {
	var typeName = types[i];
	if (!jsDom["is" + typeName]) {
		jsDom["is" + typeName] = function (obj) {
			return toString.call(obj) === "[object " + arguments.callee.typeName + "]";
		};
		jsDom["is" + typeName].typeName = typeName;
	}
}

//#region jsDom 扩展定义
jsDom.extend({
	expando: "jsDom" + (this.version + Math.random()).toString().replace(/\D/g, ""),
	isReady: false,

	error: function (msg) {
		throw new Error(msg);
	},
	// Convert String-formatted props into Object-formatted ones
	createProps: function (target, props, defValue) {
		target = target || {};
		this.each(jsDom.String.splitToArray(props), function (index, flag) {
			target[flag] = defValue;
		});
		return target;
	}
});
//#endregion
