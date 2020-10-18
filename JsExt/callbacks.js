/*
功能描述：
2.  设置一个标志位，memory 控制是否对新添加进来的回调函数也能对前值参数执行操作，也就是延迟回调；
3.  设置一个标志位，once 控制每个回调函数只能被调用一次，调用完成后立即清理回调函数列表；
4.  设置一个标志位，unique 控制回掉函数列表不能添加存在的回调函数；
5.  设置一个标志位，stopOnFalse 控制如果回调函数返回false则后续终止执行；
*/
function Callee(data, caller) {
    this.data = Array.isArray(data) ? data : [data];
    this.caller = caller;
    this.execute = function (callback) {
        return callback.apply(this.caller, this.data);
    }
}

jsDom.callbacks = function (fnOptions) {
    var StatusCode = {
        memory: 1,
        once: 2,
        unique: 4,
        stopOnFalse: 8
    }

    //#region 设置回调列表参数
    var options = {};

    if (typeof fnOptions === "function") {
        jsDom.createProps(options, fnOptions, true);
    }
    else if (jsDom.isNumber(fnOptions)) {
        for (var code in StatusCode) {
            options[code] = !!(fnOptions & StatusCode[code]);
        }
    }
    else {
        options = fnOptions || {};
    }
    //#endregion

    // 是否执行当中的标记
    var firing,
        // 标志位，前值，例如使用异步处理时，异步需要记忆以便符合条件后再执行，此时前值作为回调函数的参数
        memory,
        list = [],
        queue = [],

        fire = function () {
            var callback, callee;
            // 为所有未决的执行执行回调，尊重firingIndex覆盖和运行时更改
            firing = true;

            //执行所有回调函数
            for (var j = 0; j < queue.length; j++) {
                if ((callee = queue.shift()) instanceof Callee) {
                    for (var i = 0; i < list.length; i++) {
                        if (typeof (callback = list[i]) !== "function") {
                            continue;
                        }
                        memory = callee;
                        if (memory.execute(callback) === false && options.stopOnFalse) {
                            break;
                        }
                    }
                }
            }

            // Forget the data if we're done with it
            if (!options.memory) {
                memory = false;
            }

            firing = false;

            if (options.once) {
                list = [];
            }

        },
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function (callback) {
                if (typeof callback !== "function")
                    return;

                if (list) {

                    if (memory && memory instanceof Callee && !firing) {
                        queue.push(memory);
                    }

                    if (!options.unique || !self.has(callback)) {
                        list.push(callback);
                    }

                    if (memory && memory instanceof Callee && !firing) {
                        fire();
                    }
                };

                return this;
            },
            remove: function (callback) {
                var index = list.indexOf(callback);
                while (index >= 0) {
                    list.splice(index, 1);
                    index = list.indexOf(callback);
                }
                return this;
            },
            has: function (callback) {
                return callback ? (list.indexOf(callback) >= 0) : (list.length > 0);
            },
            // 清空所有回调方法
            empty: function () {
                if (list) {
                    list = [];
                }
                return this;
            },
            fireWith: function (data, caller) {
                queue.push(new Callee(data, caller));
                if (!firing) {
                    fire();
                }
                return this;
            },
            fire: function () {
                var ret = fireWith(arguments, this);
                return ret;
            }
        };

    return self;
}
