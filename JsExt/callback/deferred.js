(function Deferred(Module, $promise, $callback, $valid) {

    function deferred(func) {
        var state = StatusCode.Pending;
        var fulFilledCallbacks = new $callback("once memory");
        var rejectedCallbacks = new $callback("once memory");

        var StatusCode = {
            Pending: "pending",     //待定,可能会转换为已实现或已拒绝状态
            fulfilled: "fulfilled", //当实现时,不得过渡到任何其他状态,必须具有一个值，该值不能更改
            rejected: "rejected"    //当被拒绝时,不得过渡到任何其他状态,必须有一个理由，不能改变
        }

        this.done = fulFilledCallbacks.add;
        this.fail = rejectedCallbacks.add;

        this.resolveWith = function(){
            fulFilledCallbacks.fireWith();
        }

        if (func && $valid.isFunction(func)) {
            func.call(this, this);
        }

        return this;
    }


    Module.register("deferred", deferred);

})(Module, Module.require("promise"), Module.require("callback"), Module.require("validate"));