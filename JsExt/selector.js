//?:pattern 匹配pattern但不获取匹配结果 ?=pattern 右侧必须为pattern ?<=pattern 位置之前为pattern的内容
//css 语法规则：字符串[string]不能包含\所以不能转义
jsDom.Expr = {
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
    ws: "\\s",
    whitespace: "[\\s\\t\\r\\n\\f]",
    attributes: "\\[{w}({ident}){w}(([*^$|!~]?=){w}('((\\\\.|[^\\\\'])*)'|\"((\\\\.|[^\\\\\"])*)\"|({ident}))|){w}\\]",
    pseudos: ":({ident})(\\((('(\\\\.|[^\\\\'])*'|\"(\\\\.|[^\\\\\"])*\")|((\\\\.|[^\\\\()[\\]]|{attributes})*)|.*)\\)|)",
    rcomma: "{w},{w}",
    rcombinators: "{w}([>+~]|{whitespace}){w}",
    TAG: "({ident}|[*])",
    ID: "#{ident}",
    CLASS: "\\.{ident}",
    CHILD: ":((first|last|only|nth|nth-last)-(of-type|child))|root|empty|not",
    MATCH:"({CLASS})|({ID})|({attributes})|({pseudos})|({rcombinators})|({TAG})"
}

function CreateRegExp() {
    var exists = false, match, i;
    var exprNames = Object.keys(jsDom.Expr);
    var expr = new RegExp("(?<=\\{\\s*)([^\\}]*)(?=\\s*\\})", "gm");
    var exprNum = new RegExp("\\d(,\\d?)?", "gm");

    for (var key in jsDom.Expr) {
        var matches = jsDom.Expr[key].match(expr);
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
                jsDom.Expr[key] = jsDom.String.format(jsDom.Expr[key], jsDom.Expr);
            }
            else {
                break;
            }
            matches = jsDom.Expr[key].match(expr);
        }
    }
}

CreateRegExp();