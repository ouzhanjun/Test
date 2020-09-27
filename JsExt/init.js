
// A central reference to the root JsDom(document)
var rootJsDom,
    init = jsDom.fn.init = function (selector, context, root) {
        if (!selector) {
            return this;
        }
        root = root || rootJsDom;

        if (selector === document) {
            this[0] = selector;
            this.length = 1;
            return this;
        } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;

            // HANDLE: $(function)
            // Shortcut for document ready
        }
    };

// Give the init function the jsDom prototype for later instantiation
init.prototype = jsDom.fn;

// Initialize central reference
rootJsDom = jsDom(document);
