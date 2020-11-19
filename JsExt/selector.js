//?:pattern 匹配pattern但不获取匹配结果 ?=pattern 右侧必须为pattern ?<=pattern 位置之前为pattern的内容
//css 语法规则：字符串[string]不能包含\所以不能转义

var initSelectMatches = function () {
    var htmlExpr = {
        ident: "[-]?{nmstart}{nmchar}*",
        name: "{nmchar}+",
        nmstart: "(?:[_a-z]|{nonascii}|{escape})",
        nonascii: "[^\\0-\\237]",
        unicode: "\\\\[0-9a-f]{1,6}(\\r\\n|[\\x20\\n\\r\\t\\f])?",
        escape: "{unicode}|\\\\[^\\n\\r\\f0-9a-f]",
        nmchar: "(?:[_a-z0-9-]|{nonascii}|{escape})",
        num: "[0-9]+|[0-9]*\\.[0-9]+",
        string: "{string1}|{string2}",
        string1: "\"([^\\n\\r\\f\\\"]|\\\\{nl}|{escape})*\"",
        string2: "'([^\\n\\r\\f\\']|\\\\{nl}|{escape})*'",
        badstring: "{badstring1}|{badstring2}",
        badstring1: "\"([^\\n\\r\\f\\\"]|\\{nl}|{escape})*\\?",
        badstring2: "'([^\\n\\r\\f\\']|\\{nl}|{escape})*\\?",
        badcomment: "{badcomment1}|{badcomment2}",
        badcomment1: "\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*",
        badcomment2: "\\/\\*[^*]*(\\*+[^/*][^*]*)*",
        baduri: "{baduri1}|{baduri2}|{baduri3}",
        baduri1: "url\\({w}([!#$%&*-~]|{nonascii}|{escape})*{w}",
        baduri2: "url\\({w}{string}{w}",
        baduri3: "url\\({w}{badstring}",
        nl: "\\n|\\r\\n|\\r|\\f",
        w: "{whitespace}*",
        whitespace: "[\\s\\t\\r\\n\\f]",
        attributes: "\\[{w}({name}){w}(([*^$|!~]?=){w}('((\\\\.|[^\\\\'])*)'|\"((\\\\.|[^\\\\\"])*)\"|({ident}))|){w}\\]",
        pseudos: ":({name})(\\((('(\\\\.|[^\\\\'])*'|\"(\\\\.|[^\\\\\"])*\")|((\\\\.|[^\\\\()[\\]]|{attributes})*)|.*)\\)|)",
        rcomma: "{w},{w}",
        rcombinators: "{w}([>+~]|{whitespace}){w}",
        word: "(?={rcombinators}|[\\.#:\\[\\]]|)[^\\.#:\\[\\]>+~\\s\\t\\r\\n\\f]+(?<={rcombinators}|[\\.#:\\[\\]]|)",
        tag: "({name}|[*])",
        id: "#{name}",
        class: "\\.{name}",
        child: ":((first|last|only|nth|nth-last)-(of-type|child))|root|empty|not",
        match: "({class})|({id})|({attributes})|({pseudos})|({rcombinators})|({word})"
    }

    var exists = false, match, matches, i;
    var exprNames = Object.keys(htmlExpr);
    var exprVar = new RegExp("(?<=\\{" + htmlExpr.whitespace + "*)([^\\}]*)(?=" + htmlExpr.whitespace + "*\\})", "gmi");
    var exprNum = new RegExp("\\d(,\\d?)?", "gmi");
    var fnMatch = function (key, expr) {
        return htmlExpr[key].match(expr);
    }

    for (var key in htmlExpr) {
        while ((matches = fnMatch(key, exprVar)) && matches.length > 0) {
            exists = false;
            for (var m in matches) {
                if (exprNum.test(match = matches[m])) {
                    continue;
                }
                if (exists = exprNames.indexOf(matches[m]) >= 0) {
                    break;
                }
            }

            if (exists === false) {
                break;
            }
            htmlExpr[key] = jsDom.String.format(htmlExpr[key], htmlExpr);
        }
    }

    jsDom.elemMatch = {
        TAG: new RegExp("^" + htmlExpr.tag + "$", "gmi"),           //是否匹配 tag
        ID: new RegExp("^" + htmlExpr.id + "$", "gmi"),             //是否匹配 id
        CLASS: new RegExp("^" + htmlExpr.class + "$", "gmi"),       //是否匹配 class
        CHILD: new RegExp("^" + htmlExpr.child + "$", "gmi"),       //是否匹配 子节点伪类
        ATTR: new RegExp("^" + htmlExpr.attributes + "$", "gmi"),   //是否匹配 特性
        PSEUDOS: new RegExp("^" + htmlExpr.pseudos + "$", "gmi"),   //是否匹配 伪类
        MATCH: new RegExp(htmlExpr.match, "gmi")
    }

    jsDom.isHTMLDoc = function (elem) {
        var namespaceURI = elem.namespaceURI,
            docElem = (elem.ownerDocument || elem).documentElement;
        return /HTML$/i.test(namespaceURI || docElem && docElem.nodeName);
    }

    jsDom.isNativeFn = function (fn) {
        var rnative = /^[^{]+\{\s*\[native \w/;
        return rnative.test(fn);
    }

    JsDom.contains = function (a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;

        return a === bup || !!(bup && bup.nodeType === 1 && (
            jsDom.isNativeFn(adown.contains) ? adown.contains(bup) :
                jsDom.isNativeFn(a.compareDocumentPosition) && a.compareDocumentPosition(bup) & 16
        ));
    }

    jsDom.querySelectorAll = function (selector, context) {
        var elementlist,
            elem,
            results = [],
            matches,
            newContext = context || context.ownerDocument || document,
            nodeType = context && context.nodeType;

        if (typeof selector !== "string" || !selector || nodeType !== 1
            && nodeType !== 9 && nodeType !== 11) {
            return results;
        }

        if (documentIsHTML) {
            if (nodeType !== 11) {
                var matchName = selector.trim();
                //id
                if (jsDom.elemMatch.ID.test(matchName)) {
                    if (nodeType === 9) {
                        if ((elem = context.getElementById(matchName))) {
                            results.push(elem);
                        }
                        return results;
                    }
                } else {
                    if (newContext && (elem = newContext.getElementById(matchName))
                        && jsDom.contains(context, elem)) {
                        results.push(elem);
                        return results;
                    }
                }
            }
            if (!newContext && newContext.nodeType && (newContext.nodeType === 1 && newContext.nodeType === 11 && context.nodeType === 9) {

                var querySelectorAll = newContext.querySelectorAll;
                if (querySelectorAll) {
                    elementlist = querySelectorAll.call(newContext, selector);
                    //return elementlist;
                }

                matches = selector.match(jsDom.elemMatch.MATCH);
                var idMatches = matches.filter(function (val) {
                    return jsDom.elemMatch.ID.test(val);
                });

                if (idMatches && idMatches.length > 0) {
                    results.push(newContext.getElementById(idMatches[0]));
                }

            }
        }
    }
}

initSelectMatches();