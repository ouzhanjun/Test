(function Class(Module) {
    var setStrClasses = function (elem, value) {
        if (elem.nodeType === 1)
            typeof elem.className !== "undefined" ? (elem.className = value) : (elem.setAttribute("class", value));
    };

    var appendClasses = function (elem, value) {
        curClass = this.getClassName(elem);
        value += " " + curClass;
        var finalValue = jsDom.String.splitToArray(value).join(" ");
        if (finalValue !== curClass) {
            typeof elem.className !== "undefined" ? (elem.className = finalValue) : (elem.setAttribute("class", finalValue));
        }
    };

    var classes = {

        getClassName: function (elem) {
            return (elem.getAttribute && elem.getAttribute("class")) || elem.className || "";
        },
        getClassList: function (elem) {
            var result = [];
            if (elem && (result = elem.classList)) {
                result = Array.prototype.slice.call(result, 0, result.length)
            }
            else {
                var classNames = this.getClassName(elem);
                result = classNames ? jsDom.String.splitToArray(classNames) : [];
            }
            return result;
        },
        hasClass: function (elem, className) {
            var i = 0;
            var classes = this.getClassList(elem);
            return className && elem && elem.nodeType === 1 && classes && classes.indexOf(className) != -1;
        },
        addClass: function (elems, value) {
            var elem,
                curClass,
                classNames = Array.isArray(value) ? value.join(" ") : value;

            if (typeof classNames === "string") {
                if (Array.isArray(elems)) {
                    for (var i in elems) {
                        if ((elem = elems[i]) && elem.nodeType === 1) {
                            appendClasses(elem, classNames);
                        }
                    }
                }
                else {
                    appendClasses(elems, classNames);
                }
            }

            return elems;
        },
        setClass: function (elems, value) {
            var finalValue = Array.isArray(value) ? (value.join(" ")) : jsDom.String.splitToArray(value).join(" ");

            if (Array.isArray(elems)) {
                for (var i in elems) {
                    setStrClasses(elems[i], finalValue);
                }
            }
            else {
                setStrClasses(elems, finalValue);
            }
        },
        removeClass: function (elems, value) {
            var classes, elem, curValues, className, j, finalValue, i = 0, length;

            var removeElementClass = function (elem, classes) {
                if (elem.nodeType === 1) {
                    curValues = " " + this.getClassName(elem) + " ";
                    length = curValues.length;
                    j = 0;
                    while ((className = classes[j++])) {
                        if ((curValues.indexOf(" " + className + " ")) >= 0) {
                            curValues = curValues.replace(" " + className + " ", "");
                        }
                    }

                    finalValue = jsDom.String.splitToArray(curValues).join(" ");
                    if (length !== finalValue.length)
                        setStrClasses(elem, finalValue);
                }
            };

            classes = jsDom.String.splitToArray(value);
            if (Array.isArray(elems)) {
                while ((elem = elems[i++])) {
                    removeElementClass.call(this, elem, classes);
                }
            }
            else {
                removeElementClass.call(this, elems, classes);
            }

            return elems;
        },
        toggleClass: function (elems, stateVal) {

        }

    }

    Module.register("classes", classes);

})(Module);