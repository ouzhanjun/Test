function EventHandler(handler, selector, data, guid) {
	this.handler = handler;
	this.selector = selector;
	this.data = data;
	this.guid = handler.guid;
	this.execute = function (event) {
		var args = new Array(arguments.length);
		args[0]=event;
		args[args.length] = this.data;
		this.handler.apply(this.selector, args);
	}
}

jsDom.Event = {
	Types: {
		Mouse: ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "onwheel"],
		Keyboard: ["keydown", "keypress", "keyup"],
		Page: ["abort", "beforeupload", "error", "hashchange", "load", "pageshow", "pagehide", "resize", "scroll", "unload"],
		Form: ["blur", "change", "focus", "focusin", "focusout", "input", "reset", "search", "select", "submit"],
		Print: ["afterprint", "beforeprint"]
	},
	dataCache: new jsDom.Data(),
	acceptData: function (owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
	},
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
	},
	attach: function (target, eventType, fn, once) {
		var orignFn = fn;
		if (once) {
			fn = function (event) {
				jsDom.Event.off(target, eventType, fn);
				return orignFn.apply(this, arguments);
			};
		}
		if (typeof eventType !== "string") {
			return;
		}
		eventType = eventType.toLowerCase();
		if (target.addEventListener) {
			target.addEventListener(eventType, fn);
		} else if (target.attachEvent) {
			target.attachEvent('on' + eventType, fn);
		} else {
			target['on' + eventType] = fn;
		}
	},
	dispatch: function (nativeEvent) {
		var i, handleObj, handler, selector, data,
			args = new Array(arguments.length);
		var event = nativeEvent;
		var handlers = (jsDom.Event.dataCache.get(this, "events") || Object.create(null))
		[event.type] || [];

		args[0] = event;

		for (i = 1; i < arguments.length; i++) {
			args[i] = arguments[i];
		}

		var j = 0;
		while (handleObj = handlers[j++]) {
			handler = handleObj.handler;
			selector = handleObj.selector;
			data = handleObj.data;
			args[args.length] = data;
			handler.apply(selector, args);
		}
	},
	add: function (elem, eventType, handler, selector, data, once) {
		var elemData = this.dataCache.get(elem);
		var handleObj = Object.create(null),
			handlers, eventHandle;

		// Only attach events to objects that accept data
		if (!this.acceptData(elem)) {
			return;
		}

		if (!elemData.events) {
			elemData.events = Object.create(null);
		}

		if (!elemData.events[eventType]) {
			elemData.events[eventType] = Object.create(Array.prototype);
		}

		handlers = elemData.events[eventType];

		if (!handler.guid) {
			handler.guid = jsDom.guid++;
		}

		if (!(eventHandle = elemData.handle)) {
			eventHandle = elemData.handle = function (e) {
				typeof jsDom !== "undefined"
					&& jsDom.Event.dispatch.apply(elem, arguments);
				once && jsDom.Event.remove(elem, eventType, handler, selector);
			};
			this.attach(elem, eventType, eventHandle, false);
		}
		//selector 可以为null
		handleObj = {
			handler: handler,
			selector: selector,
			data: data,
			guid: handler.guid
		};

		handlers.push(handleObj);
	},
	remove: function (elem, eventType, handler, selector) {
		var handlers, j, handleObj,
			elemData = this.dataCache.get(elem);

		if (!elemData || !(events = elemData.events)) {
			return;
		}

		handlers = events[eventType] || [];
		for (var i = 0; i < handlers.length; i++) {
			handleObj = handlers[i];
			if ((!handler || handleObj.guid === handler.guid) &&
				(!selector || handleObj.selector === selector && handleObj.selector)) {
				handlers.splice(i, 1);
				break;
			}
		}

		if (handlers.length === 0) {
			this.detach(elem, eventType, elemData.handle);
			delete elemData.events[eventType];
		}

		if (jsDom.isEmptyObject(events)) {
			this.dataCache.remove(elem, "events");
		}
	},
	bind: function (target, eventType, handler, data, once) {
		this.add(target, eventType, handler, null, data, once);
	},
	unbind: function (target, eventType, handler) {
		this.remove(target, eventType, handler, null);
	}
}
