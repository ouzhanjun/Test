jsDom.Data = function () {
    //expando 可能是 expandable object 的缩写，表示可扩展的对象。
    //expando property 表示可扩展对象的动态属性， 可以在运行时动态添加到对象中的属性 
    this.expando = jsDom.expando + jsDom.Data.uid++;
}

jsDom.Data.uid = 1;
jsDom.Data.prototype = {
    dataType: {
        events: "events"
    },
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
    },
    addEventHandle: function (owner, eventType, eventHandleObj, data) {
        var handlers,
            events = this.get(owner, this.dataType.events);
        if (!events) {
            var cache = this.cache(owner);
            events = cache.events = Object.create(null);
        }

        if (!events[eventType]) {
            events[eventType] = Object.create(Array.prototype);
        }

        handlers = events[eventType];
        handlers.push(eventHandleObj);
    },
    hasEventHandle:function(owner,eventType,eventhandleObj){
        var handlers,i=0,
            events = this.get(owner, this.dataType.events);
        if (!events) {
            var cache = this.cache(owner);
            events = cache.events = Object.create(null);
        }

        if (!events[eventType]) {
            events[eventType] = Object.create(Array.prototype);
        }
        handlers = events[eventType];
        for(;i<handlers.length;i++){
            if(eventhandleObj.guid==handlers[i].guid){
                return true;
            }
        }
        return false;
    }
}