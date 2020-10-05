

jsDom.Event = {
	Types: {
		Mouse: ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseout", "mouseup", "onwheel"],
		Keyboard: ["keydown", "keypress", "keyup"],
		Page: ["abort", "beforeupload", "error", "hashchange", "load", "pageshow", "pagehide", "resize", "scroll", "unload"],
		Form: ["blur", "change", "focus", "focusin", "focusout", "input", "reset", "search", "select", "submit"],
		Print: ["afterprint", "beforeprint"]
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
	add:function(){
		
	}
}
