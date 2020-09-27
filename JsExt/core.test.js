var init = new jsDom("", "");

//jsDom.String.format
console.log("-----------------------------");
console.log(jsDom.String.format("{0},{1}", "first", "last"));
console.log(jsDom.String.format("{first},{last}", { first: "first", last: "last" }));

//jsDom.String.split
console.log("-----------------------------");
console.log(jsDom.String.split("first last", "  "));
console.log(jsDom.String.split("first  last", " "));
console.log(jsDom.String.split("first last", " "));
console.log(jsDom.String.split("first last", ""));
console.log(jsDom.String.split("first last"));
console.log(jsDom.String.split("first  last"));

//jsDom.String.splitAndJoin
console.log("-----------------------------");
console.log(jsDom.String.splitAndJoin("first  last", " ", "$"));

//AddElems
console.log("-----------------------------");
var newobj = init.AddElems(["a", "b", "c"]);
//toArray
console.log("-----------------------------");
var arr = newobj.toArray();
//each
console.log("-----------------------------");
newobj.each(function (i, o) {
    console.log("each" + i + " " + o);
});
//eq
console.log("-----------------------------");
var eq = newobj.eq(1);
console.log("eq1 " + eq[0]);

//odd
console.log("-----------------------------");
var odd = newobj.odd();
odd.each(function (i, o) {
    console.log("odd" + i + " " + o);
});

//even
console.log("-----------------------------");
var even = newobj.even();
even.each(function (i, o) {
    console.log("even" + i + " " + o);
});
//first
console.log("-----------------------------");
var first = newobj.first();
console.log("first " + first[0]);

//last
console.log("-----------------------------");
var last = newobj.last();
console.log("last " + last[0]);

//getElem
console.log("-----------------------------");
var getElem = newobj.getElem(1);
console.log("getElem1 " + getElem[0]);

//jsDom.validate.isArrayLike
console.log("-----------------------------");
var a = {};
var isArrayLike = jsDom.validate.isArrayLike(a);
console.log("isArrayLike " + isArrayLike);
a[0] = 1;
a[1] = 2;
a.length = 2;
isArrayLike = jsDom.validate.isArrayLike(a);
console.log("isArrayLike " + isArrayLike);

//jsDom.validate.isPlainObject
console.log("-----------------------------");
var a = { name: "name", age: "10" };
var isPlainObject = jsDom.validate.isPlainObject(a);
console.log("isPlainObject " + isPlainObject);
a[0] = 1;
a[1] = 2;
a.length = 2;
isPlainObject = jsDom.validate.isPlainObject(a);
console.log("isPlainObject " + isPlainObject);

var a = function () { };
var isPlainObject = jsDom.validate.isPlainObject(a);
console.log("isPlainObject " + isPlainObject);

//jsDom.validate.isEmptyObject
console.log("-----------------------------");
var a = {};
var isEmptyObject = jsDom.validate.isEmptyObject(a);
console.log("isEmptyObject " + isEmptyObject);

var a = { name: "" };
var isEmptyObject = jsDom.validate.isEmptyObject(a);
console.log("isEmptyObject " + isEmptyObject);
console.log("-----------------------------");

//jsDom.error
console.log("-----------------------------");
try {
    jsDom.error("error test");
}
catch (err) {
    console.log(err);
}
//jsDom.AddElemsToTarget & jsDom.each
console.log("-----------------------------");
try {
    var target = jsDom.AddElemsToTarget({}, ["a1", "a2", "a3"]);
    jsDom.each(target, function (i, o) {
        console.log(i + ":" + o);
    })
}
catch (err) {
    console.log(err);
}

//jsDom.where
console.log("-----------------------------");
var arr = jsDom.where(["a1", "a2", "a3"], function (i, o) {
    return (o === "a1");
}, true);
for (i in arr) {
    console.log(i + "-" + arr[i]);
}

//jsDom.isType
console.log("-----------------------------");
//"Boolean Number String Function Array Date RegExp Object Error Symbol"
var valid = jsDom.validate;
console.log(valid.isBoolean(true));
console.log(valid.isNumber(11));
console.log(valid.isString("true"));
console.log(valid.isString(new String("")));
console.log(valid.isFunction(true));
console.log(valid.isFunction(String));
console.log(valid.isFunction(function () { }));
console.log(valid.isArray([]));
console.log(valid.isDate(new Date()));
console.log(valid.isRegExp(/\s/));
console.log(valid.isRegExp(new RegExp("\s")));
console.log(valid.isObject({}));
console.log(valid.isObject(arr));
console.log(valid.isObject(true));

console.log("-----------------------------");
console.log("End");