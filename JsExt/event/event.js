(function Event(Module, $core, $data, $elem, $regExpr, $valid) {
    var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    var eventTypes = {
        Mouse: ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "onwheel"],
        Keyboard: ["keydown", "keypress", "keyup"],
        Page: ["abort", "beforeupload", "error", "hashchange", "load", "pageshow", "pagehide", "resize", "scroll", "unload"],
        Form: ["blur", "change", "focus", "focusin", "focusout", "input", "reset", "search", "select", "submit"],
        Print: ["afterprint", "beforeprint"]
    };

    var returnTrue = function () {
        return true;
    }
    var returnFalse = function () {
        return false;
    }
    var Event = function (src, props) {
        if (!(this instanceof Event)) {
            return new Event(src, props);
        }

        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            //返回一个布尔值，表明当前事件是否调用了 event.preventDefault()方法。
            this.isDefaultPrevented = src.defaultPrevented ? returnTrue : returnFalse;

            this.target = src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
        }

        // Put explicitly provided properties onto the event object
        if (props) {
            $core.deepCopy(this, props);
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || Date.now();

        // Mark it as fixed
        this.isFixed = true;
    };

    Event.prototype = {
        constructor: Event,
        isFixed: false,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function () {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if (e && !this.isSimulated) {
                e.preventDefault();
            }
        },
        stopPropagation: function () {
            //调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if (e && !this.isSimulated) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if (e && !this.isSimulated) {
                e.stopImmediatePropagation();
            }

            this.stopPropagation();
        }
    }

    var specialEvents = {
        focusin: { bindType: "focus" },
        focusout: { bindType: "blur" },
        mouseenter: { bindType: "mouseover" },
        mouseleave: { bindType: "mouseout" },
        pointerenter: { bindType: "pointerover" },
        pointerleave: { bindType: "pointerout" }
    };

    var detachFun, attachFuc;

    var bindEvent = {
        detach: function (target, eventType, fn) {
            if (typeof eventType !== "string") {
                return;
            }
            eventType = eventType.toLowerCase();
            if (!detachFun) {
                if (target.removeEventListener) {
                    detachFun = function (eventType, fn) {
                        this.removeEventListener(eventType, fn);
                    }
                } else if (target.detachEvent) {
                    detachFun = function (eventType, fn) {
                        this.detachEvent('on' + eventType, fn);
                    }
                } else {
                    detachFun = function (eventType) {
                        this['on' + eventType] = null;
                    }
                }
            }
            detachFun.call(target, eventType, fn);
        },
        attach: function (target, eventType, fn) {
            if (typeof eventType !== "string") {
                return;
            }
            eventType = eventType.toLowerCase();

            if (!attachFuc) {
                if (target.addEventListener) {
                    attachFuc = function (eventType, fn) {
                        this.addEventListener(eventType, fn);
                    }
                } else if (target.attachEvent) {
                    attachFuc = function (eventType, fn) {
                        this.attachEvent('on' + eventType, fn);
                    }
                } else {
                    attachFuc = function (eventType, fn) {
                        this['on' + eventType] = fn;
                    }
                }
            }
            attachFuc.call(target, eventType, fn);
        }
    }

    var event = {
        add: function (elem, types, handler, data) {

            var handleObj, eventHandle, tmp, special,
                events, t, namespaces, origType, handlers,
                elemData = $data.get(elem);

            // Only attach events to objects that accept data
            if (!$valid.isFunction(handler) || !$elem.acceptData(elem))
                return;

            if (!handler.guid) {
                handler.guid = $core.guid++;
            }

            if (!(events = elemData.events)) {
                events = elemData.events = Object.create(null);
            }

            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    event.dispatch.apply(elem, arguments);
                };
            }

            //多种事件类型绑定一个事件处理程序
            types = (types || "").match($regExpr.rnothtmlwhite) || [""];
            t = types.length;

            while (t--) {
                //带命名空间的事件 ["click.ns.ns1", "click", "ns.ns1", index: 0, input: "click.ns.ns1", groups: undefined]
                tmp = rtypenamespace.exec(types[t]) || [];
                origType = tmp[1];
                namespaces = (tmp[2] || "");

                if (!origType) {
                    continue;
                }

                type = specialEvents[origType] || origType;

                handleObj = {
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    namespaces: namespaces
                };

                if (!(handlers = events[type])) {
                    events[type] = handlers = [];
                    //同一类型的事件只有一个方法被调用，这个方法是回调函数的集合
                    bindEvent.attach(elem, type, eventHandle);
                }

                handlers.push(handleObj);
            }
        },
        dispatch: function (nativeEvent) {
            var i, j, ret,
                events = $data.get(this, "events"),
                args = [],
                evt = event.fixEventArg(nativeEvent),
                handleObj,
                handlers = events[e.type] || [],
                special = specialEvents[e.type] || {};

            args.push(evt);

            for (i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var rnamespace = event.namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;
            i = 0;
            while ((handleObj = handlers[i++])
                && !evt.isPropagationStopped()
                && !evt.isImmediatePropagationStopped()) {
                if (!rnamespace || !handleObj.namespace || rnamespace.test(handleObj.namespace)) {
                    evt.handleObj = handleObj;
                    if (handleObj.data) {
                        evt.data = handleObj.data;
                        args.push(handleObj.data);
                    }

                    ret = handleObj.handler && (this.nodeType === 1) && handleObj.handler.apply(this, args);

                }
            }
        },
        fixEventArg: function (orgEvent) {
            return (orgEvent && orgEvent instanceof Event && orgEvent.isFixed) ?
                orgEvent : new Event(orgEvent);
        },
        addProp: function (name, hook) {
            Object.defineProperty(Event.prototype, name, {
                enumerable: true,
                configurable: true,

                get: typeof hook === "function" ?
                    function () {
                        if (this.originalEvent) {
                            return hook(this.originalEvent);
                        }
                    } :
                    function () {
                        if (this.originalEvent) {
                            return this.originalEvent[name];
                        }
                    },

                set: function (value) {
                    Object.defineProperty(this, name, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: value
                    });
                }
            });
        }
    }

    // Includes all common event props including KeyEvent and MouseEvent specific props
    $elem.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,

        which: function (event) {
            var button = event.button;

            // Add which for key events
            if (event.which == null && rkeyEvent.test(event.type)) {
                return event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
                if (button & 1) {
                    return 1;
                }

                if (button & 2) {
                    return 3;
                }

                if (button & 4) {
                    return 2;
                }

                return 0;
            }

            return event.which;
        }
    }, event.addProp);

    Module.register("event", { event, Event });
}
)(Module, Module.require("core"), Module.require("data"), Module.require("element"), Module.require("regExpr"), Module.require("validate"));