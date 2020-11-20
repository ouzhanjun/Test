var initArray = function () {
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fn, thisValue) {
            var results=[];
            if (typeof fn !== "function") {
                throw new TypeError(fn.toString() + ` is not a function`);
            }
            for (var i = 0; i < this.length; i++) {
                fn.call(thisValue,this[i],i,this) && results.push(this[i]);
            }
            return results;
        }
    }
}

initArray();
