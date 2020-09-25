
// Define a local copy of jsDom
var jsDom = function (selector, context) {
	return new jsDom.fn.init(selector, context);
};

//#region 字符串方法扩展
jsDom.String = {
	//空白字符
	spitWhiteSpace: /[\x20\t\r\n\f]+/gm,
	format: function () {
		var result = "";
		if (arguments.length > 0) {
			result = arguments[0];
			if (arguments.length == 2 && typeof (arguments[1]) == "object") {
				var args = arguments[1];
				for (var key in args) {
					var reg = new RegExp("\\{" + key + "\\}", "gm");
					if (args[key] !== undefined) {
						result = result.replace(reg, args[key]);
					}
				}
			}
			else {
				for (var i = 1; i < arguments.length; i++) {
					var reg = new RegExp("\\{" + (i - 1) + "\\}", "gm");
					if (arguments[i] !== undefined) {
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	},
	split: function (strText, separator) {
		separator = separator || this.spitWhiteSpace;
		return strText.split(separator);
	},
	splitAndJoin: function (strText, separator, Joiner) {
		separator = separator || this.spitWhiteSpace;
		Joiner = Joiner || " ";
		var tokens = this.split(strText, separator) || [];
		return tokens.join(" ").replace(/\s+/, Joiner);
	}
}
//#endregion

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

//#region jsDom.validate 验证
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
	}
}

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
		this.each(jsDom.String.split(props), function (index, flag) {
			target[flag] = defValue;
		});
		return target;
	}
});
//#endregion

jsDom.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(' '),
	function (i, typeName) {
		if (!jsDom.validate["is" + typeName]) {
			jsDom.validate["is" + typeName] = function (obj) {
				return toString.call(obj) === "[object " + typeName + "]";
			}
		}
	}
);
