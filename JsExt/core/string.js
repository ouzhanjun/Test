
(function string(Module, $regExpr) {
    var string = {
        splitToArray: function (strText, separator) {
            if (Array.isArray(strText)) {
                return strText;
            }
            if (typeof strText === "string") {
                return strText.match($regExpr.rnothtmlwhite) || [];
            }
            return [];
        },
        format: function () {
            var result = "";
            if (arguments.length > 0) {
                result = arguments[0];
                if (arguments.length == 2 && typeof (arguments[1]) == "object") {
                    var args = arguments[1];
                    for (var key in args) {
                        var reg = new RegExp("\\{\\s*" + key + "\\s*\\}", "gm");
                        if (args[key] !== undefined) {
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
                else {
                    for (var i = 1; i < arguments.length; i++) {
                        var reg = new RegExp("\\{\\s*" + (i - 1) + "\\s*\\}", "gm");
                        if (arguments[i] !== undefined) {
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }
            }
        }
    }
    
    Module.register("string", string);

})(Module, Module.require("regExpr"));
