
(function array(Module, $valid, $regExpr) {
    var array = {
        
        flat: function (arr) {
            var results = [];
            if (arr.flat && typeof arr.flat === "function") {
                return arr.flat(Infinity);
            }
            else {
                var push = function (arr, res) {
                    if (Array.isArray(arr)) {
                        var elems=arr;
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
                for (var i = 0; i < arr; i++) {
                    if (!Array.isArray(arr[i])) {
                        results.push(arr[i]);
                    }
                    else {
                        push(arr[i], reuslts);
                    }
                }
            }
            return results;
        }
    }
    Module.register("array", array);

})(Module, Module.require("validate"), Module.require("regExpr"));