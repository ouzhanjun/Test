(function Event(Module, $core, $data, $elem, $regExpr, $valid) {

    //onunload  不管有没有和用户互动过，只要用户离开页面（关闭、刷新、跳转其他页面）就会触发

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
        else {
            this.type = src;
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

            if (e) {
                e.preventDefault();
            }
        },
        stopPropagation: function () {
            //调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if (e) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if (e) {
                e.stopImmediatePropagation();
            }

            this.stopPropagation();
        }
    }

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

            var handleObj, eventHandle, tmp,
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
                    //见trigger方法，使用preventTriggered避免同一事件重复调用
                    return event.preventTriggered !== e.type ?
                        event.dispatch.apply(elem, arguments) : undefined;
                };
            }

            //多种事件类型绑定一个事件处理程序
            types = (types || "").match($regExpr.rnothtmlwhite) || [""];
            t = types.length;

            while (t--) {
                //带命名空间的事件 ["click.ns.ns1", "click", "ns.ns1", index: 0, input: "click.ns.ns1", groups: undefined]
                tmp = $regExpr.rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".");

                if (!type) {
                    continue;
                }

                handleObj = {
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    namespace: namespaces.join(".")
                };

                if (!(handlers = events[type])) {
                    events[type] = handlers = [];
                    //同一类型的事件只有一个方法被调用，这个方法是回调函数的集合
                    bindEvent.attach(elem, type, eventHandle);
                }

                handlers.push(handleObj);
            }
        },
        remove: function (elem, types, handler, mappedTypes) {
            var elemData = $data.hasData(elem) && $data.get(elem);
            var types, namespaces;

            if (!elemData || !(events = elemData.events)) {
                return;
            }

            types = (types || "").match($regExpr.rnothtmlwhite) || [""];

            t = types.length;
            while (t--) {
                tmp = $regExpr.rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".");

                if (!type) {
                    for (type in events) {
                        event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }

                handlers = events[type] || [];
                tmp = tmp[2] &&
                    new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];

                    if ((mappedTypes || origType === handleObj.origType) &&
                        (!handler || handler.guid === handleObj.guid) &&
                        (!tmp || tmp.test(handleObj.namespace))
                    ) {
                        handlers.splice(j, 1);
                    }
                }

                if (origCount && !handlers.length) {
                    delete events[type];
                }
            }

            if ($valid.isEmptyObject(events)) {
                $data.remove(elem, "handle events");
            }
        },
        dispatch: function (nativeEvent) {
            var i, j, ret, handleObj, args = [],
                events = $data.get(this, "events"),
                extEvent = event.extendEvent(nativeEvent),
                handlerQueue,
                handlers = events[extEvent.type] || [];
            //args,第一个是事件参数，剩余是其他参数
            args.push(extEvent);

            for (i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            extEvent.delegateTarget = this;

            // Determine handlers
            handlerQueue = event.handlers.call(this, extEvent, handlers);

            i = 0;
            var matched;
            while ((matched = handlerQueue[i++]) && !extEvent.isPropagationStopped()) {
                extEvent.currentTarget = matched.elem;
                j = 0;
                while ((handleObj = matched.handlers[j++]) &&
                    !extEvent.isImmediatePropagationStopped()) {
                    //event.rnamespace 由trigger生成
                    if (!extEvent.rnamespace || !handleObj.namespace ||
                        extEvent.rnamespace.test(handleObj.namespace)) {

                        if (handleObj.data) {
                            args.push(handleObj.data);
                        }

                        ret = handleObj.handler && handleObj.handler.apply(this, args);

                        //如果返回 false 则停止冒泡
                        if (ret !== undefined) {
                            if ((extEvent.result = ret) === false) {
                                extEvent.preventDefault();
                                extEvent.stopPropagation();
                            }
                        }
                    }
                }
            }

            return extEvent.result;
        },
        handlers: function (event, handlers) {
            var i,
                handlerQueue = [],
                cur = event.target;
            if (handlers.length) {
                handlerQueue.push({ elem: cur, handlers: handlers });
            }

            return handlerQueue;
        },
        extendEvent: function (orgEvent) {
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
        },
        trigger: function (event, data, elem, onlyHandlers) {
            //onlyHandlers 只处理handle的事件，不处理原生事件onclick等
            //大部分情况下event参数是type,因为event需要另外构造
            var type = event.hasOwnProperty("type") ? event.type:event,
                eventPath = [elem || document], //事件路径
                namespaces = event.hasOwnProperty("namespace") ? event.namespace.split(".") : [],
                ontype,
                data,
                lastElement,
                tmp,
                handle,
                cur = tmp = lastElement = elem || document,
                args;
            // Don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            if (type.indexOf(".") > -1) {
                namespaces = type.split(".");
                type = namespaces.shift();
            }

            ontype = type && "on" + type;

            event = event instanceof Event ? event :
                new Event(type, typeof event === "object" && event);

            //onlyHandlers 只处理handle的事件，不处理原生事件onclick等
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ?
                new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                null;

            //清空event结果，避免被复用
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            //传递的参数
            args = [event];
            if (data) {
                args.push(data);
            }

            //提前决定事件冒泡的路径,冒泡到document,window,关注全局ownerdocument
            if (!onlyHandlers && elem != window) {
				cur = cur.parentNode;
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }

                if (tmp === (elem.ownerDocument || document)) {
                    //这里的parentWindow是做什么用的？defaultView 用于firefox 框架下
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }

            //触发所有的时间路径上面的事件处理
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                lastElement = cur;
                event.type = type;

                handle = ($data.get(cur, "events") || Object.create(null))[event.type] &&
                    $data.get(cur, "handle");

                if (handle) {
                    handle.apply(cur, args);
                }
                //原生的事件及处理程序
                handle = ontype && cur[ontype];
                //如果有绑定原生的onclick事件
                if (handle && handle.apply && $valid.acceptData(cur)) {
                    //执行onclick等事件处理程序
                    event.result = handle.apply(cur, args);
                    if (event.result === false) {

                        //阻止元素默认行为，例如提交表单
                        event.preventDefault();
                    }
                }
            }
            var stopPropagationCallback = function (e) {
                e.stopPropagation();
            };
            //阻止默认行为，比如触发<a>的click事件，但不会跳转
            if (!onlyHandlers && !event.isDefaultPrevented) {
                if ($valid.acceptData(elem)) {
                    if (ontype && typeof elem[type] === "function" && elem != window) {
                        tmp = elem[ontype];

                        if (tmp) {
                            elem[ontype] = null;
                        }
                        //阻止重复触发同样的事件，因为已经冒泡
                        event.preventTriggered = type;

                        if (event.isPropagationStopped()) {
                            lastElement.addEventListener(type, stopPropagationCallback);
                        }
                        elem[type]();

                        if (event.isPropagationStopped()) {
                            lastElement.removeEventListener(type, stopPropagationCallback);
                        }

                        event.preventTriggered = undefined;

                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }
            return event.result;
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