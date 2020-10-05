jsDom.Event = {
	Types: {
		Mouse: ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "onwheel"],
		Keyboard: ["keydown", "keypress", "keyup"],
		Page: ["abort", "beforeupload", "error", "hashchange", "load", "pageshow", "pagehide", "resize", "scroll", "unload"],
		Form: ["blur", "change", "focus", "focusin", "focusout", "input", "reset", "search", "select", "submit"],
		Print: ["afterprint", "beforeprint"]
	},
	data: new jsDom.Data(),
	acceptData: function (owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
	},
	unbind: function (target, eventType, fn) {
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
	bind: function (target, eventType, fn, once) {
		var orignFn = fn;
		if (once) {
			fn = function (event) {
				jsDom.Event.unbind(target, eventType, fn);
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
	add: function (elem, eventType, handler, data, selector) {
		var elemData = data.get(elem);
		var handleObj = Object.create(null);
		var handlers, eventHandle;

		// Only attach events to objects that accept data
		if (!acceptData(elem)) {
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
				return typeof jsDom !== "undefined"
					&& jQuery.event.dispatch.apply(elem, arguments);
			};
		}

		if (selector) {
			handleObj = {
				handler: handler,
				selector: selector,
				data: data,
				guid: handler.guid
			};

			handlers.push(handleObj);
		}
	},
	dispatch: function (elem, nativeEvent) {
		var i, handleObj, handler, selector, data,
			args = new Array(arguments.length);
		var event = nativeEvent;
		var handlers = (this.data.get(elem, "events") || Object.create(null))
		[event.type] || [];

		args[0] = event;

		for (i = 2; i < arguments.length; i++) {
			args[i - 1] = arguments[i];
		}

		event.triggerTarget = elem;
		
		var j = 0;
		while (handleObj = handlers[j++]) {
			handler = handleObj.handler;
			selector = handleObj.selector;
			data = handleObj.data;
			handler.apply(selector, args);
		}
	}
}
