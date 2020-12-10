(function Deferred(Module, $promise, $callback, $valid) {

    var StatusCode = {
        Pending: "pending",     //待定,可能会转换为已实现或已拒绝状态
        fulfilled: "fulfilled", //当实现时,不得过渡到任何其他状态,必须具有一个值，该值不能更改
        rejected: "rejected"    //当被拒绝时,不得过渡到任何其他状态,必须有一个理由，不能改变
    }

    function Identity(v) {
        return v;
    }
    function Thrower(ex) {
        throw ex;
    }

    function deferred(func) {
        var state = StatusCode.Pending;
        var fulFilledCallbacks = new $callback("once memory");
        var rejectedCallbacks = new $callback("once memory");

        this.done = fulFilledCallbacks.add;
        this.fail = rejectedCallbacks.add;

        this.resolveWith = fulFilledCallbacks.fireWith;
        this.rejectWith = rejectedCallbacks.fireWith;

        this.resolve = function () {
            if (state === StatusCode.Pending) {
                state = StatusCode.fulfilled;
            }
            rejectedCallbacks.disable();
            this.resolveWith(this, arguments);
        }

        this.reject = function () {
            if (state === StatusCode.Pending) {
                state = StatusCode.rejected;
            }
            fulFilledCallbacks.disable();
            this.rejectWith(this, arguments);
        }

        this.state = function () {
            return state;
        }

        this.always = function () {
            this.done(arguments).fail(arguments);
            return this;
        }

        this.catch = function (fn) {
            this.then(null, fn);
        }

        this.then = function (onFulFilled, onRejected, onProgress) {
            //避免同时调用，只有最先到达的有效
            var maxDepth = 0;

            function resolve(depth, deferred, fulhandler, rejhandler, notifyhandler) {

            }
            
        }

        if (func && $valid.isFunction(func)) {
            func.call(this, this);
        }

        return this;
    }


    Module.register("deferred", deferred);

})(Module, Module.require("promise"), Module.require("callback"), Module.require("validate"));