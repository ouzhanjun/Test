
jsDom.fn.bind = function (target, eventType, fn) {
	if (typeof eventType !== "string") {
		return;
	}
	eventType = eventType.toLowerCase();
	if (target.addEventListener) {
		target.addEventListener(eventType, fn, false);
	} else if (target.attachEvent) {
		target.attachEvent('on' + eventType, fn);
	} else {
		target['on' + eventType] = fn;
	}
}

jsDom.fn.unbind = function (target, eventType, fn) {
	if (typeof eventType !== "string") {
		return;
	}
	eventType = eventType.toLowerCase();
	if (target.removeEventListener) {
		target.removeEventListener(eventType, fn, false);
	} else if (target.detachEvent) {
		target.detachEvent('on' + eventType, fn);
	} else {
		target['on' + eventType] = null;
	}
}

//Document事件
JDOMDocumentEvent = function (selector) {
	this.constructor = JDOMDocumentEvent;
	this.selector = selector;

	this.DOMContentLoaded = function (fn) {
		if (typeof (fn) === "function") {
			this.CompleteDomContentLoaded = function (selector) {
				fn();
				selector.removeEventListener("DOMContentLoaded", this.CompleteDomContentLoaded);
			}
			if (this.selector.readyState !== "loading") {
				window.setTimeout(fn);
			}
			else {
				this.selector.addEventListener("DOMContentLoaded", this.CompleteDomContentLoaded(this.selector));
			}
		}
	}
}

