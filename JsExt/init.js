
var rootJsDom,
    idExpr = /^(?:\s*#([\w-]+))$/gm,
    rhtml = /<|&[a-zA-Z0-9]{2,6};|&#\d{1,3}};/gm,   //<a>或&nbsp;或&#160;
    rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,      //匹配标签<a></a>或<a>或<a/>
    
    init = jsDom.fn.init = function (selector, context, root) {
        if (!selector) {
            return this;
        }

        root = root || rootJsDom;
        if (jsDom.isString(selector)) {
            if (idExpr.test(selector.trim())) {
                //#id

            }
            else if (rsingleTag.test(selector)) {
                //匹配标签<tag></tag>或<tag>或<tag/>

            }
            else if(rhtml.test(selector)){
                //其他html

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
