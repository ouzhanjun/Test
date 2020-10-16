jsDom.Data = function () {
    //expando 可能是 expandable object 的缩写，表示可扩展的对象。
    //expando property 表示可扩展对象的动态属性， 可以在运行时动态添加到对象中的属性 
    this.expando = jsDom.expando + jsDom.Data.uid++;
}

jsDom.Data.uid = 1;
jsDom.Data.cacheType = {
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

jsDom.EventData = jsDom.Data.prototype;

jsDom.extend(jsDom.EventData, {
    getEvent: function (owner, eventType) {
        var event = this.get(owner, jsDom.Data.cacheType.Event);
        return eventType ? event[eventType] : event;
    },
    addEventData: function (owner, eventType, data, unique) {
        var cache = this.cache(owner);
        if (!cache[jsDom.Data.cacheType.Event]) {
            cache[jsDom.Data.cacheType.Event] = Object.create(null);
        }
        if (!cache[jsDom.Data.cacheType.Event][eventType]) {
            cache[jsDom.Data.cacheType.Event][eventType] = [];
        }
        var datas = cache[jsDom.Data.cacheType.Event][eventType];
        if (unique && datas.indexOf(data) >= 0) {
            return;
        }
        datas.push(data);
    },
    removeEventData: function (owner, eventType, data) {
        var cache = this.cache(owner);
        if (!cache[jsDom.Data.cacheType.Event] || !cache[jsDom.Data.cacheType.Event][eventType]) {
            return;
        }
        var datas = cache[jsDom.Data.cacheType.Event][eventType];
        var index = datas.indexOf(data);
        if (index >= 0) {
            datas.splice(index, 1);
        }
        if(datas.length===0 && cache[jsDom.Data.cacheType.Event][eventType]){
            delete cache[jsDom.Data.cacheType.Event][eventType];
        }
        if(jsDom.isEmptyObject(cache[jsDom.Data.cacheType.Event])){
            this.remove(owner,jsDom.Data.cacheType.Event);
        }
    }
});