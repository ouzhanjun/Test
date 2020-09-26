var xeditor = function () {
    var cmdNames = ["bold", "copy", "cut", "selectAll","open","saveAs","print","delete",
    "insertImage", "formatblock", "backColor"];
    var keyValues = {};
    for (var i in cmdNames) {
        var name = cmdNames[i];
        this[name] = function (val) {
            document.execCommand(arguments.callee.cmd, false, val);
        }
        this[name].cmd = name;
    }
}