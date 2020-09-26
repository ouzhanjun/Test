
function resolvePromise(promise, result, resolve, reject) {
    var then;
    var thenCalledOrThrow = false

    if (promise === result) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }

    if ((result !== null) && ((typeof result === 'object') || (typeof result === 'function'))) {
        try {
            then = result.then;
            if (isFunction(then)) {
                then.call(result, function rs(value) {
                    if (thenCalledOrThrow) return;
                    thenCalledOrThrow = true;
                    return resolvePromise(promise, value, resolve, reject);
                }, function rj(reason) {
                    if (thenCalledOrThrow) return;
                    thenCalledOrThrow = true;
                    return reject(reason);
                });
            } else {
                return resolve(result);
            }
        } catch (reason) {
            if (thenCalledOrThrow) return;
            thenCalledOrThrow = true;
            return reject(reason);
        }
    } else {
        return resolve(result);
    }
}
//func 以 resolve,reject 作为参数
jsDom.Promise = function (fn) {
    var isFunction = function (fn) {
        return typeof fn === "function" && typeof fn.nodeType !== "number";
    }
    if (!isFunction(fn)) {
        throw new Error('The parameter must be a function');
    }

    var self = this;

    var StatusCode = {
        Pending: "pending",     //待定,可能会转换为已实现或已拒绝状态
        fulfilled: "fulfilled", //当实现时,不得过渡到任何其他状态,必须具有一个值，该值不能更改
        rejected: "rejected"    //当被拒绝时,不得过渡到任何其他状态,必须有一个理由，不能改变
    }

    this.status = StatusCode.Pending;
    this.fulfilledCallbacks = new jsDom.callbacks("once memory");   //具有一个值，该值不能更改
    this.rejectedCallbacks = new jsDom.callbacks("once memory");    //有一个理由，不能改变

    var _resolve = function (val) {
        self.fulfilledCallbacks.fire.call(this, val);
    }

    var _reject = function (val) {
        self.rejectedCallbacks.fire.call(this, val);
    }

    var resolve = function (val) {
        window.setTimeout(function () {
            if (self.status === StatusCode.Pending) { //Pending 待定
                self.status = StatusCode.fulfilled;   //fulfilled 已实现
                if (val && val.then) {
                    val.then({
                        function(val) {
                            _resolve(val);
                        }, function(reason) {
                            _reject(reason);
                        }
                    })
                }
                else {
                    _resolve(val);
                }
            }
        })
    }

    var reject = function (val) {
        window.setTimeout(function () {
            if (self.status === StatusCode.Pending) { //Pending 待定
                self.status = StatusCode.rejected;    //rejected 已实现
                _reject(val);
            }
        })
    }

    try {
        fn(resolve, reject);
    } catch (reason) {
        reject(reason);
    }

    //#region 忽略要处理的函数
    function Identity(v) {
        return v;
    }
    function Thrower(ex) {
        throw ex;
    }
    //#endregion

    this.then = function (onFulfilled, onRejected) {
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : Identity;
        onRejected = isFunction(onRejected) ? onRejected : Thrower;

        var nextPromise;
        var self = this;

        switch (self.status) {
            case StatusCode.fulfilled:
                nextPromise = new jsDom.Promise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            var result = this.fulfilledCallbacks.add(onFulfilled);
                            resolvePromise(nextPromise, result, resolve, reject);
                        }
                        catch (reason) {
                            reject(reason);
                        }
                    })
                });
                break;
            case StatusCode.rejected:
                nextPromise = new jsDom.Promise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            var result = this.rejectedCallbacks.add(onRejected);
                            resolvePromise(nextPromise, result, resolve, reject);
                        }
                        catch (reason) {
                            reject(reason);
                        }
                    })
                });
                break;
            case StatusCode.Pending:
                nextPromise = new Promise(function (resolve, reject) {
                    self.fulfilledCallbacks.add(function (value) {
                        try {
                            var result = onFulfilled(value);
                            resolvePromise(nextPromise, result, resolve, reject);
                        } catch (reason) {
                            reject(reason);
                        }
                    })

                    self.rejectedCallbacks.add(function (reason) {
                        try {
                            var result = onRejected(reason);
                            resolvePromise(nextPromise, result, resolve, reject);
                        } catch (reason) {
                            reject(reason);
                        }
                    })
                });
                break;
        }
        return nextPromise;
    }

    this.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    }

    this.finally = function (fn) {
        return this.then(function (v) {
            setTimeout(fn);
            return v;
        }, function (reason) {
            setTimeout(fn);
            throw reason;
        })
    }

    this.spread = function (fn, onRejected) {
        return this.then(
            function (values) {
                return fn.apply(null, values)
            }
        );
    }

    this.delay = function (duration) {
        return this.then(function (value) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(value)
                }, duration)
            })
        }, function (reason) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject(reason)
                }, duration)
            })
        })
    }
}

jsDom.Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(function (value) {
                return resolve(value)
            }, function (reason) {
                return reject(reason)
            })
        }
    })
}

jsDom.Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        var resolvedCounter = 0
        var promiseNum = promises.length
        var resolvedValues = new Array(promiseNum)
        for (var i = 0; i < promiseNum; i++) {
            (function (i) {
                Promise.resolve(promises[i]).then(function (value) {
                    resolvedCounter++
                    resolvedValues[i] = value
                    if (resolvedCounter == promiseNum) {
                        return resolve(resolvedValues)
                    }
                }, function (reason) {
                    return reject(reason)
                })
            })(i)
        }
    })
}

jsDom.Promise.resolve = function (value) {
    var promise = new Promise(function (resolve, reject) {
        resolvePromise(promise, value, resolve, reject)
    })
    return promise
}

jsDom.Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason)
    })
}
