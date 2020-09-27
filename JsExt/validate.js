
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
	},
	isFunction: function (fn) {
		return typeof fn === "function" && typeof fn.nodeType !== "number";
	}
}
//#endregion

jsDom.each("Boolean Number String Array Date RegExp Object Error Symbol".split(' '),
	function (i, typeName) {
		if (!jsDom.validate["is" + typeName]) {
			jsDom.validate["is" + typeName] = function (obj) {
				return toString.call(obj) === "[object " + typeName + "]";
			}
		}
	}
);
