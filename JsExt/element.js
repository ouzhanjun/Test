/*
ELEMENT_NODE	    1	<h1 class="heading">W3School</h1>
ATTRIBUTE_NODE	    2	class = "heading" （弃用）
TEXT_NODE	        3	W3School
COMMENT_NODE	    8	<!-- 这是注释 -->
DOCUMENT_NODE	    9	HTML 文档本身（<html> 的父）
DOCUMENT_TYPE_NODE	10	<!Doctype html>
*/
var wrapMap = {

    // Table parts need to be wrapped with `<table>` or they're
    // stripped to their contents when put in a div.
    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do, so we cannot shorten
    // this by omitting <tbody> or other required elements.
    // 前面的数字用于指定在表格中的位置，以便做出裁剪
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jsDom.element = {
    createNode: function (htmltag) {
        //将一段html 转换为 Document Object Model （文档对象模型）,而不影响到当前的html内容，可以通过document.implementation.createHTMLDocument创建一个新的document实现
        var doc = document.implementation.createHTMLDocument("");
        let tempNode = doc.createElement('div');
        tempNode.innerHTML = htmltag;
        return tempNode.firstChild;
    },
    createDocumentFragment: function (htmltag) {
        var doc = document.implementation.createHTMLDocument("");
        let fragContainer = doc.createDocumentFragment();
        let frag = doc.createRange().createContextualFragment(htmltag);

        fragContainer.appendChild(frag);
        return fragContainer.firstChild;
    },
    isAttached: function (elem) {
        return elem.ownerDocument && elem.ownerDocument.contains(elem);
    },
    nodeName: function (elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },
    getElementsByTagName: function (context, tag) {
        var ret;
        if (typeof context.getElementsByTagName !== "undefined") {
            ret = context.getElementsByTagName(tag || "*");
        }
        else if (typeof context.querySelectorAll !== "undefined") {
            ret = context.querySelectorAll(tag || "*");
        }
        else {
            ret = [];
        }

        if (tag === undefined || tag && this.nodeName(context, tag)) {
            return [context].concat(ret);
        }

        return ret;
    },
    buildFragment: function (elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, matches,
            attached,
            nodes = [], j, i = 0,
            len = elems.length;

        var base, parsed, scripts;

        if (!context) {
            context = document.implementation.createHTMLDocument("");
            base = context.createElement("base");
            base.href = document.location.href;
            context.head.appendChild(base);
        }

        var fragment = context.createDocumentFragment();

        for (; i < len; i++) {

            elem = elems[i];

            if (elem || elem === 0) {
                if (typeof elem === "object" && elem.nodeType) {
                    nodes.push(elem);
                }
                else if (!rhtml.test(elem)) {
                    nodes.push(context.createTextNode(elem));
                }
                else {
                    tmp = tmp || fragment.appendChild(context.createElement("div"));
                    matches = elem.match(rtagName);
                    if (matches && matches.length > 1) {
                        tag = matches[1].toLowerCase();
                    }
                    //解决table的问题
                    wrap = wrapMap[tag] || wrapMap._default;
                    tmp.innerHTML = (wrap[1] + elem + wrap[2]);

                    j = wrap[0];
                    while (j--) {
                        tmp = tmp.lastChild;
                    }

                    jsDom.merge(nodes, tmp.childNodes);

                    tmp = fragment.firstChild;
                    tmp.textContent = "";
                }
            }
        }

        //清空节点文字
        fragment.textContent = "";

        i = 0;
        while (elem = nodes[i++]) {
            if (selection && selection.indexOf(elem) >= 0) {
                if (ignored) {
                    ignored.push(elem);
                }
                continue;
            }

            tmp = this.getElementsByTagName(fragment.appendChild(elem), "script");

            if (scripts) {
                j = 0;
                while (elem = tmp[j++]) {
                    if (rscriptType.test(elem.type || "")) {
                        scripts.push(elem);
                    }
                }
            }
        }

        return fragment;
    },
    parseHTML: function (data, context, keepScripts) {
        var matches, base, scripts, parsed;
        if (!context) {
            context = document.implementation.createHTMLDocument("");
            base = context.createElement("base");
            base.href = document.location.href;
            context.head.appendChild(base);
        }
        if (typeof data !== "string") {
            return [];
        }
        else if (matches = data.match(rsingleTag)) {
            if (matches) {
                return [context.createElement(matches[1])];
            }
        }
        else {
            parsed = this.buildFragment([data], context, scripts);

            if (scripts && scripts.length) {
                jsDom(scripts).remove();
            }
            return jsDom.merge( [], parsed.childNodes );
        }
    }
}