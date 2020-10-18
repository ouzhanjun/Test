function EventHandler(handler, selector, data, guid) {
	this.handler = handler;
	this.selector = selector;
	this.data = data;
	this["guid"]= this.handler["guid"] = guid;
	
	this.execute = function (event) {
		var args = new Array(arguments.length);
		args[0] = event;
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
	attach: function (target, eventType, fn) {
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
		var handlers = jsDom.EventData.getEvent(this, event.type) || [];

		var j = 0;
		while (handler = handlers[j++]) {
			if (handler instanceof EventHandler) {
				handler.execute(event);
			}
		}
	},
	add: function (elem, eventType, handler, selector, data, once) {
		var elemData;
		var handlers, eventHandle, newHandler;

		// Only attach events to objects that accept data
		if (!this.acceptData(elem)) {
			return;
		}

		newHandler = new EventHandler(handler, elem, data, jsDom.guid++);
		jsDom.EventData.addEventData(elem, eventType, newHandler);
		elemData = jsDom.EventData.getEvent(elem, eventType);
		if (!(eventHandle = elemData.handle)) {
			eventHandle = elemData.handle = function (e) {
				typeof jsDom !== "undefined"
					&& jsDom.Event.dispatch.apply(elem, arguments);
				once && jsDom.Event.remove(elem, eventType, handler, selector);
			};
			this.attach(elem, eventType, eventHandle);
		}
	},
	remove: function (elem, eventType, handler, selector) {
		var handlers, j,
			elemData = jsDom.EventData.getEvent(elem, eventType);

		if (!elemData) {
			return;
		}

		jsDom.EventData.removeEventData(elem, eventType, handler);

		if ((handlers = elemData) && handlers.length === 0 && elemData.handle) {
			this.detach(elem, eventType, elemData.handle);
		}
	},
	bind: function (target, eventType, handler, data, once) {
		this.add(target, eventType, handler, null, data, once);
	},
	unbind: function (target, eventType, handler) {
		this.remove(target, eventType, handler, null);
	}
}
