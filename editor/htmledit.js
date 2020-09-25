var xeditor = function () {
    var cmdNames =
        [
            "bold", "italic","strikeThrough","copy", "cut", "selectAll", "delete", "paste", "redo", "undo", "underline", "unlink",
            
            "insertImage", "formatblock", "backColor", "createLink",
            "fontName", "fontSize", "foreColor",
            "contentReadOnly", "decreaseFontSize", , "ClearAuthenticationCache",
            "defaultParagraphSeparator", "enableAbsolutePositionEditor", "enableInlineTableEditing",
            "enableObjectResizing", "forwardDelete", "heading", "hiliteColor", "increaseFontSize",
            "indent", "insertBrOnReturn", "insertHorizontalRule", "insertHTML",
            "insertOrderedList", "insertUnorderedList", "insertParagraph", "insertText",
             "justifyCenter", "justifyFull", "justifyLeft", "justifyRight", "outdent",
            "removeFormat",  "subscript", "superscript",
            "styleWithCSS"
        ];

    for (var i in cmdNames) {
        var name = cmdNames[i];
        this[name] = function (val) {
            document.execCommand(arguments.callee.cmd, false, val);
        }
        this[name].cmd = name;
    }
}