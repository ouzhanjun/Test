/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *  
 */
/*
功能描述：
1.  保存要执行的回调函数，并且可以通过fire重复执行回调函数列表；
2.  设置一个标志位，memory 控制是否对新添加进来的回调函数也能对前值参数执行操作，也就是延迟回调；
3.  设置一个标志位，once 控制每个回调函数只能被调用一次，调用完成后立即清理回调函数列表；
4.  设置一个标志位，unique 控制回掉函数列表不能添加存在的回调函数；
5.  设置一个标志位，stopOnFalse 控制如果回调函数返回false则后续终止执行；
6.  Lock 方法调用后，locked标志位=true, 
    a. 不能再调用fire去执行回掉函数;
    b. 回调函数列表被清空；
    c. memory=true时，如果memory存在数据可以添加新的回调函数，并立即被调用；
7. disable 将禁用所有功能；
*/

jsDom.callbacks = function (fnOptions) {
    var StatusCode = {
        memory: 1,
        once: 2,
        unique: 4,
        stopOnFalse: 8
    }
    //#region 设置回调列表参数
    var options;
    if (jsDom.isString(fnOptions)) {
        options = {};
        jsDom.createProps(options, fnOptions, true)
    }
    else if (jsDom.isNumber(fnOptions)) {
        options = {};
        for (var code in StatusCode) {
            options[code] = !!(fnOptions & StatusCode[code]);
        }
    }
    else {
        options = fnOptions || {};
    }
    //#endregion

    // Flag to know if list is currently firing
    var firing,
        // 标志位，前值，例如使用异步处理时，异步需要记忆以便符合条件后再执行，此时前值作为回调函数的参数
        memory,
        list = [],

        fire = function (args, caller) {
            var callback, lastResult;
            // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
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
                var ret = -1;
                ret = list.indexOf(callback);
                return ret;
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
            // Remove all callbacks from the list
            empty: function () {
                if (list) {
                    list = [];
                }
                return this;
            },
            //外部调用fire,如果加锁，则不执行回调，否则所有回调函数都执行
            fire: function () {
                var ret = fire(arguments, this);
                return ret;
            }
        };

    return self;
}
