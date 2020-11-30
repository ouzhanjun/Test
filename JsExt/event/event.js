(function Event(Module, $data, $elem, $regExpr) {
    var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    var eventTypes = {
        Mouse: ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "onwheel"],
        Keyboard: ["keydown", "keypress", "keyup"],
        Page: ["abort", "beforeupload", "error", "hashchange", "load", "pageshow", "pagehide", "resize", "scroll", "unload"],
        Form: ["blur", "change", "focus", "focusin", "focusout", "input", "reset", "search", "select", "submit"],
        Print: ["afterprint", "beforeprint"]
    };

    var Event = function (src, props) {
        if (!(this instanceof Event)) {
            return new Event(src, props);
        }

        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            //返回一个布尔值，表明当前事件是否调用了 event.preventDefault()方法。
            this.isDefaultPrevented = src.defaultPrevented ? true : false;

            this.target = src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
        }
        else {
            this.type = src;
        }

        if (props) {
            
        }
    };

    var event = {
        add: function (elem, eventTypes, handler, data) {
            var handleObjIn, eventHandle, tmp,
                events, t, namespaces, origType,
                elemData = $data.get(elem);

            if ($elem.acceptData(elem)) {
                return;
            }

            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }

            if (!(events = elemData.events)) {
                events = elemData.events = Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    //dispatch events
                };
            }
            eventTypes = (eventTypes || "").match($regExpr.rnothtmlwhite) || [""];
            t = eventTypes.length;

            while (t--) {
                //["click.ns.ns1", "click", "ns.ns1", index: 0, input: "click.ns.ns1", groups: undefined]
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();

                if (!type) {
                    continue;
                }

                //如果是focusin,focusout,就应该转成
                handleObjIn.type = type;

            }
        },
        dispatch: function (nativeEvent) {
            var args = new Array[arguments.length];

        }
    }
    Module.register("event", { event, Event });
}
)(Module, Module.require("data"), Module.require("element"), Module.require("regExpr"));