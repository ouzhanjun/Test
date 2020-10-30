//?:pattern 匹配pattern但不获取匹配结果 ?=pattern 右侧必须为pattern ?<=pattern 位置之前为pattern的内容
//css 语法规则：字符串[string]不能包含\所以不能转义

jsDom.initExpr = function () {
    var exprStr = {
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
        chname: "(?={rcombinators}|[\\.#:\\[\\]]|)[^\\.#:\\[\\]>+~\\s\\t\\r\\n\\f]+(?<={rcombinators}|[\\.#:\\[\\]]|)",
        tag: "({name}|[*])",
        id: "#{name}",
        class: "\\.{name}",
        child: ":((first|last|only|nth|nth-last)-(of-type|child))|root|empty|not",
        match: "({class})|({id})|({attributes})|({pseudos})|({rcombinators})|({chname})"
    }
    
    var exists = false, match, i;
    var exprNames = Object.keys(exprStr);
    var exprVar = new RegExp("(?<=\\{" + exprStr.whitespace + "*)([^\\}]*)(?=" + exprStr.whitespace + "*\\})", "gmi");
    var exprNum = new RegExp("\\d(,\\d?)?", "gmi");
    var fnMatch = function (key, expr) {
        return exprStr[key].match(expr);
    }

    for (var key in exprStr) {
        var matches = fnMatch(key, exprVar);
        while (matches && matches.length > 0) {
            exists = false;
            for (var m in matches) {
                if (exprNum.test(match = matches[m])) {
                    continue;
                }
                if (exists = exprNames.indexOf(matches[m]) >= 0) {
                    break;
                }
            }

            if (exists === true) {
                exprStr[key] = jsDom.String.format(exprStr[key], exprStr);
                matches = fnMatch(key, exprVar);
            }
            else {
                break;
            }
        }
    }

    jsDom.DomFindExpr = {
        TAG: new RegExp(exprStr.tag, "gmi"),
        ID: new RegExp(exprStr.id, "gmi"),
        CLASS: new RegExp(exprStr.class, "gmi"),
        MATCH: new RegExp(exprStr.match, "gmi"),
        CHILD: new RegExp(exprStr.child, "gmi")
    }
}

jsDom.initExpr();