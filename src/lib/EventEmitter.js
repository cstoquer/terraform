
//████████████████████████████████████████████████████████████████████████████
//██▄ ▄▄▄ █████████████████████▀████▄ ▄▄▄ ███████████▄██▀████▀████████████████
//███ ▀ ██▄ ▄█▄ ▄▀▄▄▄▀█▄ ▀▄▄▀█▄ ▄▄███ ▀ ███▄ ▀▄▀▀▄▀█▄ █▄ ▄▄█▄ ▄▄██▀▄▄▄▀█▄ ▀▄▄█
//███ █▄████ █ ██ ▄▄▄▄██ ███ ██ █████ █▄████ ██ ██ ██ ██ ████ ████ ▄▄▄▄██ ████
//██▀ ▀▀▀ ███ ███▄▀▀▀▀█▀ ▀█▀ ▀█▄▀▀▄█▀ ▀▀▀ █▀ ▀█ ▀█ █▀ ▀█▄▀▀▄█▄▀▀▄█▄▀▀▀▀█▀ ▀▀██
//████████████████████████████████████████████████████████████████████████████
/**
 * @class EventEmitter
 *
 * @desc  see http://nodejs.org/api/events.html
 *        This is a custom version of EventEmitter,
 *        in order to be faster and more suitable for
 *        canvas rendering.
 *
 */

function EventEmitter() {
	this._EventEmitter_events = {};
}

#REPLACE({
	"_EventEmitter_events":       ["__events__",         "E$0"],
	"setMaxListeners":            ["setMaxListeners",    "E$2"],
	"removeListener":             ["removeListener",     "E$3"],
	"removeAllListeners":         ["removeAllListeners", "E$4"]
})

(function () { var proto = EventEmitter.prototype;

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.listeners
 *
 * @desc   return the list of function binded to an even name.
 *         if the event doesn't exist, then create an empty list.
 *
 *
 * @param {String} eventName - event name
 *
 * TODO: put this method inline ??
 */
proto.listeners = function (eventName) {
	var events = this._EventEmitter_events;
	return events[eventName] ? events[eventName] : events[eventName] = [];
};


/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.on
 *
 * @desc   register a new function to an event
 *
 * @param {String}   eventName - event name
 * @param {Function} f         - function to call everytime event is emitted
 * @param {Number}   [priority]- event priority
 */
proto.on = function (eventName, f, priority) {
	var events = this._EventEmitter_events;
	var listeners = events[eventName] ? events[eventName] : events[eventName] = [];
	// test if listener has not already been set (same event name, same function)
	if (listeners.indexOf(f) !== -1) return this;
	// set function priority
	f.priority = priority || 0;
	// add listener
	listeners.push(f);
	// sort listeners by priority (reverse order)
	listeners.sort(function (a, b) {
		return b.priority - a.priority;
	});
	// this.emit('newListener', eventName, f);
	return this;
};

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.changeEventPriority
 *
 * @desc   ...
 *
 * @param {String}   eventName - event name
 * @param {Function} f         - function to call everytime event is emitted
 * @param {Number}   [priority]- event priority
 */
proto.changeEventPriority = function (eventName, f, priority) {
	var events = this._EventEmitter_events;
	var listeners = events[eventName];
	if (!listeners) throw new Error('No event ' + eventName);
	var index = listeners.indexOf(f);
	if (!index) throw new Error('Function not registered');
	listeners[index].priority = priority || 0;
	// sort listeners by priority (reverse order)
	listeners.sort(function (a, b) {
		return b.priority - a.priority;
	});
	return this;
};

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.once
 *
 * @desc   
 *
 * @param {String}   eventName - event name
 * @param {Function} f         - function to call when event is emitted.
 * @param {Number}   [priority]- event priority
 */
proto.once = function (eventName, f, priority) {
	this.on(eventName, function g () {
		f.apply(this, arguments);
		this.removeListener(eventName, g);
	}, priority);
};


/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.removeListener
 *
 * @desc   remove one listener for a function f
 *
 * @param {String}   eventName - event name
 * @param {Function} f         - registered function.
 */
proto.removeListener = function (eventName, f) {
	var e = this._EventEmitter_events[eventName];
	if (!e) return this;
	var index;
	if ((index = e.indexOf(f)) !== -1) e.splice(index, 1);
	return this;
};

/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.removeAllListeners
 *
 * @desc   remove all listeners
 *
 * @param {String} eventName - event name
 */
proto.removeAllListeners = function (eventName) {
	if (!eventName) {
		// if no event name specified wipe out all events
		this._EventEmitter_events = {};
		return this;
	}
	// remove particular event
	delete this._EventEmitter_events[k];
	return this;
};


/**▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * @method module:EventEmitter.emit
 *
 * @desc   emit an event
 *
 * @param {String} eventName - event name
 */
proto.emit = function (eventName) {
	// don't do anything if there is no listeners
	var fns = this._EventEmitter_events[eventName];
	if (!fns) return 0;
	// get all arguments except eventName
	var args = Array.prototype.slice.call(arguments, 1);
	// run through and apply all listeners.
	// TODO: check if we want to add listeners while apply them
	for (var i = 0; i < fns.length; i++) {
		if (fns[i].apply(this, args)) return i;
	}
	return fns.length;
};


})();
