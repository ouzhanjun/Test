var xeditor = function () {
    var editCommands = [
        "copy", "cut", "paste", "delete",
        "bold", "strikeThrough", "italic", "underline", "selectAll",
        "subscript", "superscript",
        "justifyCenter", "justifyFull", "justifyLeft", "justifyRight",
        "fontName", "fontSize", "foreColor", "backColor",
        "indent", "outdent",
        "removeFormat", "hiliteColor"
    ];
    var createCommands = [
        "createLink", "unlink",
        "formatblock", "forwardDelete",
        "insertImage", "insertParagraph", "insertHorizontalRule",
        "insertText", "insertHTML",
        "insertOrderedList", "insertUnorderedList",
        "increaseFontSize", "heading", "decreaseFontSize"
    ];
    var controlCommands = [
        "redo", "undo",
        "insertBrOnReturn", "ClearAuthenticationCache", "contentReadOnly",
        "useCSS", "styleWithCSS",
        "defaultParagraphSeparator",
        "enableObjectResizing", "enableInlineTableEditing", "enableAbsolutePositionEditor",
    ];
    
    var commandTypes = [editCommands, createCommands, controlCommands];
    for (var gid in commandTypes) {
        for (var i in commandTypes[gid]) {
            var name = commandTypes[gid][i];
            this[name] = function (val) {
                document.execCommand(arguments.callee.cmd, false, val);
            }
            this[name].cmd = name;
        }
    }
}