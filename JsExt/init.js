
var rootJsDom,
    idExpr = /(?<=^([\x20\t\r\n\f]*))#([\w-]+)(?=([\x20\t\r\n\f]*)$)/,
    rhtml = /<|&[a-zA-Z0-9]{2,6};|&#\d{1,3}};/gm,   //<a>或&nbsp;或&#160;
    rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,      //匹配标签<a></a>或<a>或<a/>
    rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
    rscriptType = /^$|^module$|\/(?:java|ecma)script/i,
    init = jsDom.fn.init = function (selector, context, root) {
        if (!selector) {
            return this;
        }
        var matches, elem, elems;
        root = root || rootJsDom;
        if (jsDom.isString(selector)) {
            if (matches = selector.match(idExpr)) {
                //#id
                matches = selector.match(idExpr);
                if (elem = document.getElementById(matches[2])) {
                    this.push(elem);
                }
                return this;
            }
            else if (matches = selector.match(rsingleTag)) {
                //匹配标签<tag></tag>或<tag>或<tag/>
                if (elem = document.createElement(matches[1].toLowerCase())) {
                    this.push(elem);
                }
                return this;
            }
            else if (rhtml.test(selector)) {
                //其他html
                elems = jsDom.element.parseHTML(selector, context && context.nodeType ? context.ownerDocument || context : document, true);
                this.push(elems);
            }
            else {
                //其它字符串

            }
        } else if (selector.nodeType) {

        } else if (jsDom.isFunction(selector)) {

        }
    };

// Give the init function the jsDom prototype for later instantiation
init.prototype = jsDom.fn;

// Initialize central reference
rootJsDom = jsDom(document);
