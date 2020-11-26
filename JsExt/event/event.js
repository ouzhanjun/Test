(function Event(Module, data) {
    var eventTypes = {
        Mouse: ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "onwheel"],
        Keyboard: ["keydown", "keypress", "keyup"],
        Page: ["abort", "beforeupload", "error", "hashchange", "load", "pageshow", "pagehide", "resize", "scroll", "unload"],
        Form: ["blur", "change", "focus", "focusin", "focusout", "input", "reset", "search", "select", "submit"],
        Print: ["afterprint", "beforeprint"]
    };
    var acceptData = function (owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
    };
    var event = {
        detach: function (target, eventType, fn) {
            if (typeof eventType !== "string") {
                return;
            }
            eventType = eventType.toLowerCase();
            if (target.removeEventListener) {
                target.removeEventListener(eventType, fn);
            } else if (target.detachEvent) {
                target.detachEvent('on' + eventType, fn);
            } else {
                target['on' + eventType] = null;
            }
        }

    }
    Module.register("event", event);
}
)(Module, Module.require("data"));