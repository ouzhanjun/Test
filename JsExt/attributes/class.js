
jsDom.Class = {

    getClass: function (elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
    },
    getClasses: function (elem) {
        var className = this.getClass(elem);
        return className ? jsDom.String.splitToArray(className) : [];
    },
    hasClass: function (elem, value) {
        var i = 0;
        var classes = getClasses(elem).filter(
            function (x) {
                return x === value;
            });
        return classes.length > 0;
    },
    addClass: function (value) {
        var classes, elem, cur, curValue, curValues, className, j, finalValue,
            i = 0;

        if (typeof value === "function") {
            return this.each(function (j) {
                jsDom(this).addClass(value.call(this, j, getClass(this)));
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
                        if (curValues.indexOf(className) < 0) {
                            curValues.push(className);
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

    },
}
