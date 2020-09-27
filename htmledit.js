var xeditor = function () {
    var cmdNames = ["bold", "copy", "cut", "selectAll","open","saveAs","print","delete"];
    var cmdNamesWithArgs = ["insertImage", "formatblock", "backColor","FontName","FontSize"
,"ForeColor"];
    var keyValues = {};
    for (var i in cmdNames) {
        var name = cmdNames[i];
        this[name] = function () {
            document.execCommand(arguments.callee.cmd, false, null);
        }
        this[name].cmd = name;
    }
    for (var i in cmdNamesWithArgs) {
        var name = cmdNamesWithArgs[i];
        this[name] = function (val) {
            document.execCommand(arguments.callee.cmd, false, null);
        }
        this[name].cmd = name;
    }
}