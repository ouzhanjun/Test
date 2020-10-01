
// Define a local copy of jsDom
var jsDom = function (selector, context) {
	return new jsDom.fn.init(selector, context);
};

jsDom.validate = {
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
	}
}

var types = ["Boolean", "Number", "String", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
for (var i in types) {
	var typeName = types[i];
	if (!jsDom.validate["is" + typeName]) {
		jsDom.validate["is" + typeName] = function (obj) {
			return toString.call(obj) === "[object " + arguments.callee.typeName + "]";
		};
		jsDom.validate["is" + typeName].typeName=typeName;
	}
}

//#region jsDom 对象 定义
jsDom.prototype = {
	version: "jsDom 1.0.0",
	constructor: jsDom,
	AddElems: function (elems) {
		var ret = jsDom.AddElemsToTarget(this.constructor(), elems);
		ret["prevObject"] = this;
		return ret;
	},
	toArray: function () {
		return Array.prototype.slice.call(this);
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
//#endregion

jsDom.fn = jsDom.prototype;
jsDom.extend = jsDom.fn.extend;

//#region jsDom 扩展定义
jsDom.extend({
	isReady: false,

	error: function (msg) {
		throw new Error(msg);
	},
	AddElemsToTarget: function (target, elems) {
		if (!target) {
			if (Array.isArray(elems)) {
				target = [];
			}
			else {
				target = {};
			}
		}
		var len = +elems.length, j = 0, i = 0;

		for (; j < len; j++) {
			target[i++] = elems[j];
		}

		target.length = i;
		return target;
	},
	each: function (obj, callback) {
		//如果是基本类型或者函数则可以直接赋值，如果是对象或数组则进行回归
		var length, i = 0;

		if (jsDom.validate.isArrayLike(obj)) {
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
	where: function (elems, callback, expVal) {	//根据回调函数返回是否true,过滤元素
		var matches = [],
			i = 0,
			expVal = expVal || true,
			length = elems.length;

		for (; i < length; i++) {
			if (callback(i, elems[i]) === expVal) {
				matches.push(elems[i]);
			}
		}

		return matches;
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
