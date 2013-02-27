/**
 * Events, helper class to work with events.
 * This is a 'Singleton' type of helper. You
 * don't need to create an instance, just call
 * the methods on this class.
 * 
 * Code largely based on Peter Nederlof's work,
 * mainly cause he first showed me how to do
 * this and our coding styles are almost identical.
 * 
 * Most significant change compared to 1.0 is that
 * 2.0 cleans up at unload.
 *
 * @class
 * @version 2.0.091018
 * @author Martin Reurings - http://www.windgazer.nl/
 * @credits: Peter Nederlof - http://www.xs4all.nl/~pnederlof/
 */

var Events = {
	safRE:/safari/i,
	aRE:/^a$/i,
    eventQueue:new Array(),
	/**
	 * Attaches an event to an element. Uses DOM methods when available, but
	 * falls back to onXXXX handlers when needed.
	 *
	 * @param {Element} element The element you want to attach an event handler to.
	 * @param {String} type The type of event you want to react on.
	 * @param {function} handler A function to handle the event, takes the event as parameter (for non-IE browsers).
	 * @return An Array that contains the type, function and element with which you just attached.
	 * @type EventWrapper
	 */
	attach:function(element, type, handler) {
		var result = null;
		if (element.addEventListener) result = element.addEventListener(type, handler, false);
		else if(element.attachEvent) result = element.attachEvent('on' + type, handler);
		else element['on' + type] = handler;
        //Create JSON which contains all the relevant bits
        var attachedID = {type:type, handler:handler, element:element, result:result};
        //Check if cleanup has been registered.
        if (this.eventQueue.length == 0) {
            this.eventQueue.push(false); //prevent recursion...
            var self = this;
            this.eventQueue[0] = this.attach(document.body||document.documentElement, "unload", function(){
                self.clean();
            });
        }
        //Register this new event.
        this.eventQueue.push(attachedID);
        //Return new event details.
		return attachedID;
	},
	/**
	 * Detaches an event that has been attached using Events.attach. Makes
	 * use of DOM methods with a fallback to onXXX handlers.
	 * If you didn't store the EventWrapper but have the correct set of data
	 * just pass the data on with the following syntax:
	 * Events.detach({type:String, handler:function, element:Element});
	 * 
	 * @param {EventWrapper} eventWrapper An object that contains the type, function and element with which you want to detach.
	 */
	detach:function(eventWrapper) {
		var element = eventWrapper.element;
		if (element.removeEventListener) element.removeEventListener(eventWrapper.type, eventWrapper.handler, false);
		else if(element.detachEvent) element.detachEvent('on' + eventWrapper.type, eventWrapper.handler);
		else element['on' + eventWrapper.type] = null;
	},
	/**
	 * Cancels an event using DOM methods, returns false. Preferably when
	 * you want to cancel events return the result of this function from your
	 * handler, this will encertain to some degree that onXXX handlers will
	 * also cancel the default action.
	 * On Safari this method will overwrite the onClick method of a link to
	 * return false before setting back it's original onClick method. This
	 * is because the DOM methods do not work on Safari even though they
	 * exist.
	 *
	 * @param {Event} event The event that you need to cancel.
	 * @return false
	 * @type boolean
	 */
	cancel:function(event) {
		try {
			event.preventDefault();
			event.stopPropagation();
		} catch (e) {
			event.returnValue = false;
		}
		if (Events.safRE.test(navigator.userAgent)) {
			var target = event.target;
			if (target.nodeName == "#text") target = target.parentNode;
		 	if (Events.aRE.test(target.nodeName)) {
				var oldClick = target.onclick;
		 		target.onclick = function() {
					target.onclick = oldClick;
					return false;
				};
			}
		} return false;
	},
    clean:function() {for (var i = 0; i < this.eventQueue.length; this.detach(this.eventQueue[i++]));}
}
