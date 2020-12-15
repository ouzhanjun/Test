(function Validate(Module, $regExpr) {
    var validate = {
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
        isXMLDoc: function (elem, arr, i) {
            var namespace = elem.namespaceURI,
                docElem = (elem.ownerDocument || elem).documentElement;

            return !$regExpr.rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

        }
    }

    Module.register("validate", validate);

})(Module, Module.require("regExpr"));