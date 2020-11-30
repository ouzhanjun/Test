(function Class(Module, $string, $data) {
    var setClassName = function (elem, value) {
        if (elem.nodeType === 1)
            typeof elem.className !== "undefined" ? (elem.className = value) : (elem.setAttribute("class", value));
        return elem;
    };

    var classes = {

        getClass: function (elem) {
            return (elem.getAttribute && elem.getAttribute("class")) || elem.className || "";
        },
        getClassList: function (elem) {
            var result = [];
            if (elem && (result = elem.classList)) {
                result = Array.prototype.slice.call(result, 0, result.length)
            }
            else {
                var classNames = this.getClass(elem);
                result = classNames ? $string.splitToArray(classNames) : [];
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
                classNames = Array.isArray(value) ? value.join(" ") : value;

            var appendClass = function (elem, value) {
                curClass = this.getClass(elem);
                value += " " + curClass;
                var finalValue = $string.splitToArray(value).join(" ");
                if (finalValue !== curClass) {
                    typeof elem.className !== "undefined" ? (elem.className = finalValue) : (elem.setAttribute("class", finalValue));
                }
            };
            if (typeof classNames === "string") {
                if (Array.isArray(elems)) {
                    for (var i in elems) {
                        if ((elem = elems[i]) && elem.nodeType === 1) {
                            appendClass.call(this, elem, classNames);
                        }
                    }
                }
                else {
                    appendClass.call(this, elems, classNames);
                }
            }

            return elems;
        },
        setClass: function (elems, value) {
            var finalValue = Array.isArray(value) ? (value.join(" ")) : $string.splitToArray(value).join(" ");

            if (Array.isArray(elems)) {
                for (var i in elems) {
                    setClassName(elems[i], finalValue);
                }
            }
            else {
                setClassName(elems, finalValue);
            }
            return elems;
        },
        removeClass: function (elems, value) {
            var classes, elem, curValues, className, j, finalValue, i = 0, length;

            var removeElementClass = function (elem, classes) {
                if (elem.nodeType === 1) {
                    curValues = " " + this.getClass(elem) + " ";
                    length = curValues.length;
                    j = 0;
                    while ((className = classes[j++])) {
                        if ((curValues.indexOf(" " + className + " ")) >= 0) {
                            curValues = curValues.replace(" " + className + " ", " ");
                        }
                    }

                    finalValue = $string.splitToArray(curValues).join(" ");
                    if (length !== finalValue.length)
                        setClassName(elem, finalValue);
                }
            };

            classes = $string.splitToArray(value);
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
        toggleClass: function (elems, value, stateVal) {
            var type = typeof value,
                className, i, classNames, elem,
                isValidValue = type === "string" || Array.isArray(value);
            var _toggleClass = function (elem, value, stateVal) {
                if (isValidValue) {
                    i = 0;
                    classNames = $string.splitToArray(value);

                    while (className = classNames[i++]) {
                        if (this.hasClass(elem, className)) {
                            this.removeClass(elem, className);
                        } else {
                            this.addClass(elem, className);
                        }
                    }
                }
                else if (value === undefined || type === "boolean") {
                    className = this.getClass(elem);
                    if (className) {
                        $data.set(this, "__className__", className);
                    }
                    if (elem.setAttribute) {
                        elem.setAttribute("class",
                            className || value === false ?
                                "" :
                                $data.get(this, "__className__") || "");
                    }
                }
            }

            if (typeof stateVal === "boolean" && isValidValue) {
                return stateVal ? this.addClass(elems, value) : this.removeClass(elems, value);
            }

            if (Array.isArray(elems)) {
                for (var i = 0; i < elems.length; i++) {
                    if (typeof value === "function") {
                        this.toggleClass(elems, value.call(this, i, this.getClass(this)), stateVal);
                    }
                    else {
                        elem = elems[i];
                        _toggleClass.call(this, elem, value);
                    }
                }
            }
            else {
                _toggleClass.call(this, elems, value);
            }
            return elems;
        }
    }

    Module.register("classes", classes);

})(Module, Module.require("string"), Module.require("data"));