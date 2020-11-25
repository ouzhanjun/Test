
jsDom.Class = {

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
        return className && classes.indexOf(className) != -1;
    },
    addClass: function (elems, value) {
        var elem,
            curClass,
            finalValue,
            classNames = Array.isArray(value) ? value.join(" ") : value;

        if (typeof classNames === "string") {
            for (var i in elems) {
                if ((elem = elems[i]) && elem.nodeType === 1) {
                    curClass = this.getClassName(elem);
                    classNames += " " + curClass;
                    finalValue = jsDom.String.splitToArray(classNames).join(" ")
                    if (finalValue !== curClass) {
                        typeof elem.className !== "undefined" ? (elem.className = finalValue) : (elem.setAttribute("class", finalValue));
                    }
                }
            }
        }

        return elems;
    },
    removeClass: function (value) {
        var classes, elem, cur, curValue, curValues, className, j, finalValue, index
        i = 0;

        if (typeof value === "function") {
            return this.each(function (j) {
                jsDom(this).removeClass(value.call(this, j, getClass(this)));
            });
        }

        classes = jsDom.split(value);

        if (classes.length) {
            while ((elem = this[i++])) {
                curValues = this.getClasses(elem);
                curValue = curValues.join(' ');
                cur = elem.nodeType === 1;

                if (cur) {
                    j = 0;
                    while ((className = classes[j++])) {
                        if ((index = curValues.indexOf(className)) >= 0) {
                            curValues.splice(index, 1);
                        }
                    }

                    // Only assign if different to avoid unneeded rendering.
                    finalValue = curValues.join(' ');
                    if (curValue !== finalValue) {
                        elem.setAttribute("class", finalValue);
                    }
                }
            }
        }

        return this;

    }
}
