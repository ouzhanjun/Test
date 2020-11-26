
(function Data(Module) {
    var EXPANDO = "__$data__";
    var data = {
        cache: function (owner) {
            var value = owner[EXPANDO];
            if (!value) {
                value = Object.create(null);
                Object.defineProperty(owner, EXPANDO, {
                    value: value,
                    configurable: true,
                    enumerable: false,
                    writable: true
                });
            }
            return value;
        },
        set: function (owner, key, value) {
            var prop,
                cache = this.cache(owner);
            if (typeof key === "string") {
                cache[key] = value;
            }
            else {
                for (prop in key) {
                    cache[prop] = key[prop];
                }
            }
            return cache;
        },
        get: function (owner, key) {
            return key === undefined ?
                this.cache(owner) :
                owner[EXPANDO] && owner[EXPANDO][key];
        },
        access: function (owner, key, value) {
            if (key === undefined ||
                ((key && typeof key === "string") && value === undefined)) {

                return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== undefined ? value : key;
        },
        remove: function (owner, key) {
            var cache = owner[EXPANDO];

            if (cache === undefined) {
                return;
            }

            if (key !== undefined) {
                if (cache[key]) {
                    delete cache[key];
                }
            }

            if (key === undefined || jsDom.isEmptyObject(cache)) {
                if (owner.nodeType) {
                    owner[EXPANDO] = undefined;
                }
                else {
                    delete owner[EXPANDO];
                }
            }
        },
        hasData: function (owner) {
            var cache = owner[EXPANDO];
            return cache !== undefined && !jQuery.isEmptyObject(cache);
        }
    }

    Module.register("data", data);

})(Module);