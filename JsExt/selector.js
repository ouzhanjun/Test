//?:pattern 匹配pattern但不获取匹配结果 ?=pattern 右侧必须为pattern ?<=pattern 位置之前为pattern的内容
//comment: /* anything but * followed by / */
//newline:\n \r\n \r \f
//whitespace: \\x20(\s) \t newline
//hex digit: 0-9 a-f A-F
//escape : 1.not newline or hex digit 2.hex digit{1,6} +whitespace?
//ident-token 
var comment = "/\\*.*\\*/",
    newline = "[\\r\\n\\f]|\\r\\n",
    whitespace = "[\\x20\\t\\r\\n\\f]",
    hexdigit = "[\\da-fA-F]",
    // "////" 转义就是 \，值为“＆B”的标识符可以写为\ 26 B或\ 000026B
    escape = "\\\\(" + hexdigit + "{1,6}" + whitespace + "?|([^\\r\\n\\f]|" + hexdigit + "))",
    // https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    identifier = "(" + escape + "|([a-zA-Z_]|[^\0-\\x7f])+([\\w-]|[^\0-\\x7f])+)",
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

        // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace +

        // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
        whitespace + "*\\]",


    pseudos = ":(" + identifier + ")(?:\\((" +

        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
        // 1. quoted (capture 3; capture 4 or capture 5)
        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

        // 2. simple (capture 6)
        "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

        // 3. anything else (capture 2)
        ".*" +
        ")\\)|)";