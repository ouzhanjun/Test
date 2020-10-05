var test = {
	getName: function (name) {
		console.log(name);
	},
	getAge: function (age) {
		console.log(age);
	}
}

var test1 = {
	getName: function (name) {
		console.log("name:" + name);
	},
	getAge: function (age) {
		console.log("age:" + age);
	}
}

var callbacks = new jsDom.callbacks();

//添加 add
callbacks.add(test.getName);
callbacks.fire("fire");

//移除 remove
callbacks.remove(test.getName);
callbacks.fire("remove , nothing is shown");

//#region once 
var callbacks1 = new jsDom.callbacks("once");

//添加 add
callbacks1.add(test.getName);
callbacks1.add(test1.getName);
callbacks1.fire("owen2");
callbacks1.fire("nothing is shown because once");
//add
callbacks1.add(test.getName);
//#endregion

//#region once memory
var callbacks2 = new jsDom.callbacks("once memory");

//添加
callbacks2.add(test.getName);
callbacks2.add(test1.getName);
callbacks2.fire("owen4");

//add
callbacks2.add(test1.getName);
callbacks2.add(test.getName);
//#endregion

//#region memory
//getCallbacks
var callbacks3 = new jsDom.callbacks("memory");
console.log(callbacks3.has(test.getName));

//添加 add
callbacks3.add(test.getName);
callbacks3.add(test1.getName);

//has
console.log(callbacks3.has(test.getName));
