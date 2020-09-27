
//#region 字符串方法扩展
jsDom.String = {
	//空白字符
    rnothtmlwhite: /[^\x20\t\r\n\f]+/gm,
    
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
	splitToArray: function (strText, separator) {
		if ( Array.isArray( strText ) ) {
            return strText;
        }
        if ( typeof strText === "string" ) {
            return strText.match( this.rnothtmlwhite ) || [];
        }
        return [];
	}
}
//#endregion