jsDom.Data = function () {
    //expando 可能是 expandable object 的缩写，表示可扩展的对象。
    //expando property 表示可扩展对象的动态属性， 可以在运行时动态添加到对象中的属性 
    this.expando = jsDom.expando + jsDom.Data.uid++;
}

jsDom.Data.uid = 1;
jsDom.Data.dataType = {
    Event: "Event"
};

jsDom.Data.prototype = {

    cache: function (owner) {
        var value = owner[this.expando];
        if (!value) {
            value = Object.create(null);
            Object.defineProperty(owner, this.expando, {
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
                cache[prop] = data[prop];
            }
        }
        return cache;
    },
    get: function (owner, key) {
        return key === undefined ?
            this.cache(owner) :
            owner[this.expando] && owner[this.expando][key];
    },
    access: function (owner, key, value) {
        if (key === undefined ||
            ((key && typeof key === "string") && value === undefined)) {

            return this.get(owner, key);
        }
        this.set(owner, key, value);
        return this;
    },
    remove: function (owner, key) {
        var cache = owner[this.expando];

        if (cache === undefined) {
            return;
        }

        if (key !== undefined) {
            if (cache[key]) {
                delete cache[key];
            }
        }

        if (key === undefined || jsDom.isEmptyObject(cache)) {
            delete owner[this.expando];
        }
    },
    hasData: function (owner) {
        var cache = owner[this.expando];
        return cache !== undefined && !jQuery.isEmptyObject(cache);
    }
}

function DataDictionary() {
};
DataDictionary.prototype =new jsDom.Data();
DataDictionary.prototype.getEvent = function (owner) {
    return this.get(owner, jsDom.Data.dataType.Event);
}

DataDictionary.prototype.setEventHandler = function (owner, eventType, handler) {
    var handlers,
        events = this.get(owner, jsDom.Data.dataType.Event);
    if (!events) {
        var cache = this.cache(owner);
        events = cache.events = Object.create(null);
    }

    if (!events[eventType]) {
        events[eventType] = Object.create(Array.prototype);
    }

    handlers = events[eventType];
    handlers.push(handler);
}

DataDictionary.prototype.hasEventHandler = function (owner, eventType, handler) {
    var handlers, i = 0,
        events = this.get(owner, this.dataType.events);
    if (!events) {
        var cache = this.cache(owner);
        events = cache.events = Object.create(null);
    }

    if (!events[eventType]) {
        events[eventType] = Object.create(Array.prototype);
    }
    handlers = events[eventType];
    for (; i < handlers.length; i++) {
        if (handler.guid == handlers[i].guid) {
            return true;
        }
    }
    return false;
}

DataDictionary.prototype.removeEventHandler = function (owner, eventType, handler) {
    var handlers, i = 0,
        events = this.get(owner, this.dataType.events);
    if (!events || !events[eventType]) {
        return;
    }

    handlers = events[eventType];
    for (; i < handlers.length; i++) {
        if (handler.guid == handlers[i].guid) {
            handlers.splice(i, 1);
        }
    }
}
