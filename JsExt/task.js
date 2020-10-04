jsDom.Task = function (fn) {

    var promise = new jsDom.Promise();
    this.done = function (fn) {
        promise.then(fn);
        return this;
    }
    this.fail = function (fn) {
        promise.then(undefined, fn);
        return this;
    }
    this.start = function (fn) {
        var val = fn;
        if (jsDom.isFunction(fn)) {
            try{
                val = fn();
            }
            catch(r){
                promise.reject(r);
            }
        }
        promise.resolve(val);
        return this;
    }
    this.resolve = promise.resolve;
    this.reject = promise.reject;
}