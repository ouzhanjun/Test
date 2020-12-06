(function Callback(Module, $string, $valid, $array) {
    /*
    功能描述：
    2.  设置一个标志位，memory 控制是否对新添加进来的回调函数也能对前值参数执行操作，也就是延迟回调；
    3.  设置一个标志位，once 控制每个回调函数只能被调用一次，调用完成后立即清理回调函数列表；
    4.  设置一个标志位，unique 控制回掉函数列表不能添加存在的回调函数；
    5.  设置一个标志位，stopOnFalse 控制如果回调函数返回false则后续终止执行；
    */
    var Options = {
        memory: 1,
        once: 2,
        unique: 4,
        stopOnFalse: 8
    }
    var createOptions = function (props) {
        var object = {};
        if (typeof props === "string") {
            var arr = $string.splitToArray(props);
            for (var i in arr) {
                if (Options[arr[i]]) {
                    object[arr[i]] = true;
                }
            }
        }
        else if (typeof props === "object") {
            for (var key in props) {
                if (!Options[key] || !props[key])
                    continue;
                object[key] = !!props[key];
            }
        }

        return object;
    }

    var Callee = function (caller, data) {
        this.execute = function (callback) {
            return callback.apply(caller, data);
        }
    }

    var Callback = function (opt) {
        options = createOptions(opt);

        var firing,
            memory,
            fired,
            list = [],
            queue = [],
            // Flag to prevent firing
            locked,

            fire = function () {
                var callback, callee;
                // Enforce single-firing
                locked = locked;

                fired = firing = true;
                while (queue.length) {
                    if ((callee = queue.shift()) instanceof Callee) {
                        for (var i = 0; i < list.length; i++) {
                            if (typeof (callback = list[i]) !== "function") {
                                continue;
                            }
                            if (callee.execute(callback) === false && options.stopOnFalse) {
                                memory = null;
                                break;
                            }
                        }
                    }
                }

                if (!options.memory) {
                    memory = null;
                }

                firing = false;

                // Clean up if we're done firing for good
                if (locked || options.once) {

                    // Keep an empty list if we have data for future add calls
                    if (memory) {
                        list = [];

                        // Otherwise, this object is spent
                    } else {
                        list = "";
                    }
                }
            },
            self = {
                has: function (callback) {
                    return callback ? list.indexOf(callback) >= 0 : list.length > 0;
                },
                add: function (callbacks) {
                    if (list) {
                        var callback;
                        if (memory && memory instanceof Callee && !firing) {
                            queue.push(memory);
                        }
                        if (Array.isArray(callbacks)) {
                            var _callbacks = $array.flat(callbacks);
                            for (var i = 0; i < _callbacks.length; i++) {
                                if ($valid.isFunction(callback = _callbacks[i])) {
                                    if (!options.unique || !this.has(callback)) {
                                        list.push(callback);
                                    }
                                }
                            }
                        }
                        else if ($valid.isFunction(callbacks)) {
                            if (!options.unique || !this.has(callbacks)) {
                                list.push(callbacks);
                            }
                        }

                        if (memory && memory instanceof Callee && !firing) {
                            fire();
                        }
                    }
                    return this;
                },
                empty: function () {
                    if (list) {
                        list = [];
                    }
                    return this;
                },
                remove: function () {
                    var index;
                    var args = arguments;
                    for (var i = 0; i < args.length; i++) {
                        if (index = list.indexOf(args[i]) >= 0) {
                            list.splice(index, 1);
                        }
                    }
                    return this;
                },
                // Disable .fire and .add
                // Abort any current/pending executions
                // Clear all callbacks and values
                disable: function () {
                    locked = queue = [];
                    list = memory = "";
                    return this;
                },
                disabled: function () {
                    return !list;
                },

                // Disable .fire
                // Also disable .add unless we have memory (since it would have no effect)
                // Abort any pending executions
                lock: function () {
                    locked = queue = [];
                    if (!memory && !firing) {
                        list = memory = "";
                    }
                    return this;
                },
                locked: function () {
                    return !!locked;
                },
                fireWith: function (context, args) {
                    args = args && [args];
                    args = new Callee(context, args);
                    queue.push(args);
                    if (!firing) {
                        fire();
                    }
                    return this;
                },
                fire: function () {
                    this.fireWith(this, arguments);
                    return this;
                },
                fired: function () {
                    return !!fired;
                }
            };
        return self;
    }

    Module.register("callback", Callback);

})(Module, Module.require("string"), Module.require("validate"), Module.require("array"));