/*
功能描述：
2.  设置一个标志位，memory 控制是否对新添加进来的回调函数也能对前值参数执行操作，也就是延迟回调；
3.  设置一个标志位，once 控制每个回调函数只能被调用一次，调用完成后立即清理回调函数列表；
4.  设置一个标志位，unique 控制回掉函数列表不能添加存在的回调函数；
5.  设置一个标志位，stopOnFalse 控制如果回调函数返回false则后续终止执行；
*/

jsDom.callbacks = function (options) {
    var StatusCode = {
        memory: 1,
        once: 2,
        unique: 4,
        stopOnFalse: 8
    }

    //#region 设置回调列表参数
    var options;

    if (jsDom.isString(options)) {
        options = {};
        jsDom.createProps(options, options, true);
    }
    else if (jsDom.isNumber(options)) {
        options = {};
        for (var code in StatusCode) {
            options[code] = !!(options & StatusCode[code]);
        }
    }
    else {
        options = options || {};
    }
    //#endregion

    // 是否执行当中的标记
    var firing,
        // 标志位，前值，例如使用异步处理时，异步需要记忆以便符合条件后再执行，此时前值作为回调函数的参数
        memory,
        list = [],

        fire = function (args, caller) {
            var callback, lastResult;
            // 为所有未决的执行执行回调，尊重firingIndex覆盖和运行时更改
            firing = true;

            //执行所有回调函数
            for (var i = 0; i < list.length; i++) {
                callback = list[i];

                lastResult = callback.apply(caller, args);
                memory = args;

                // Run callback and check for early termination
                if (lastResult === false && options.stopOnFalse) {
                    break;
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

            return lastResult;
        },
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function (callback) {
                var ret;
                if (list) {
                    if (!options.unique || this.indexOf(callback) < 0) {
                        list.push(callback);
                    }

                    if (memory && !firing) {
                        ret = fire(memory, this);
                    }
                };

                return ret;
            },
            remove: function (callback) {
                var index = this.indexOf(callback);
                while (index >= 0) {
                    list.splice(index, 1);
                    index = this.indexOf(callback);
                }
                return this;
            },
            indexOf: function (callback) {
                return list.indexOf(callback);
            },
            has: function (callback) {
                var ret = false;
                if (callback) {
                    ret = this.indexOf(callback) >= 0;
                }
                else {
                    ret = list.length > 0;
                }
                return ret;
            },
            // 清空所有回调方法
            empty: function () {
                if (list) {
                    list = [];
                }
                return this;
            },
            fire: function () {
                var ret = fire(arguments, this);
                return ret;
            }
        };

    return self;
}
