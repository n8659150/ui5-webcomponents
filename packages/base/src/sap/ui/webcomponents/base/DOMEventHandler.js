import ControlEvents from "./events/ControlEvents";
import getOriginalEventTarget from "./events/getOriginalEventTarget";
import WebComponent from "./WebComponent";

const handleEvent = function handleEvent(event) {
	// Get the DOM node where the original event occurred
	let target = getOriginalEventTarget(event);
	event.ui5target = target;

	// Traverse the DOM
	let shouldPropagate = true;
	while (shouldPropagate && target instanceof HTMLElement) {
		shouldPropagate = processDOMNode(target, event);
		if (shouldPropagate) {
			target = getParentDOMNode(target);
		}
	}
};


const processDOMNode = function processDOMNode(node, event) {
	if (node && node instanceof WebComponent) {
		return dispatchEvent(node, event);
	}
	return true;
};

const dispatchEvent = function dispatchEvent(ui5WebComponent, event) {
	// Handle the original event (such as "keydown")
	ui5WebComponent._handleEvent(event);
	if (event.isImmediatePropagationStopped()) {
		return false;
	}

	/* eslint-disable */
	if (event.isPropagationStopped()) {
		return false;
	}
	/* eslint-enable */

	return true;
};

const getParentDOMNode = function getParentDOMNode(node) {
	const parentNode = node.parentNode;

	if (parentNode && parentNode.host) {
		return parentNode.host;
	}

	return parentNode;
};


class DOMEventHandler {
	constructor() {
		throw new Error("Static class");
	}

	static start() {
		ControlEvents.bindAnyEvent(handleEvent);
	}

	static stop() {
		ControlEvents.unbindAnyEvent(handleEvent);
	}
}

export default DOMEventHandler;
