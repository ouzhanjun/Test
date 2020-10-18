function PropOptions(getFn, setFnconfigurable, enumerable, value, writable) {
    var options = {};
    typeof configurable === "boolean" && (options["configurable"] = configurable);
    typeof enumerable === "boolean" && (options["enumerable"] = enumerable);
    typeof value !== undefined && (options["value"] = value);
    typeof writable === "boolean" && (options["writable"] = writable);
    typeof getFn === "function" && (options["getFn"] = getFn);
    typeof setFn === "function" && (options["setFn"] = setFn);
    return options;
};

jsDom.extend(jsDom, {
    addProp: function (obj, propName, getFn, setFn) {
        var prop = {};
        if (setFn && typeof setFn === "function") {
            prop["set"] = setFn;
        }

        if (getFn && typeof getFn === "function") {
            prop["get"] = getFn;
        }

        Object.defineProperty(obj, propName, prop);
    }
});