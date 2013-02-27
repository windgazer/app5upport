/**
 * FastButtonListener is a singleton class that listens to certain
 * events in order to ascertain if that was a valid call to action
 * on a 'fast button'.
 * The concept of a 'fast button' is based on an answer by google
 * to my own negative experiences with using 'anchors' as call to
 * action elements and how this fails to bring the right kind of
 * responsiveness on HTML5 based applications.
 * 
 * As a result it borrows from my own LinkListener and the concepts
 * outlined in the google article, on hopes of creating the same
 * powerful and easy-to-use solution as what I had before...
 * 
 * @see https://developers.google.com/mobile/articles/fast_buttons
 */

var FastButtonListener = ( function( w, document, eventsGlobal ){

	var re 				= /^a$/i,
		startNode		= false,
		touchTime		= 0,
		body			= document.documentElement||document.body,
		handlers		= {},
		touchEnd		= false,
		mouseUp			= false
		events			= eventsGlobal;

	//Setup some extra  handlers and init the right info
	function handleStart(e) {

		var e = e||event,
			t = e.target||e.srcElement;

		//validate target node;
		var a = validateNode( t );
		if ( startNode === false && a !== false ) {
			//Add start node
			startNode = a;
			//Add  handlers
			var f = function( e ) {
				handleEnd(e);
			}
			touchEnd = events.attach( body, "touchend", f );
			//Add  handlers
			mouseUp = events.attach( body, "mouseup", f );
		}

	}
	
	function handleEnd(e) {
		
		if ( startNode !== false ) {

			var e = e||event,
				t = e.target||e.srcElement;
			
			if ( startNode && startNode.n === t ) {
				handleClick( e );
			}
			startNode = false;
	
			reset();
		}

		return events.cancel( e );
	}

	function handleClick( e ) {

		var r = handlers[startNode.rel]( startNode );

	}
	
	function reset() {
		//unset events
		if (mouseUp){
			events.detach(mouseUp);
			mouseUp = false;
		}
		if (touchEnd) {
			events.detach(touchEnd);
			touchEnd = false;
		}
	}
	
	function validateNode( n ) {

		if ( re.test( n.nodeName ) ) {

			var a = parseNode( n );
			if ( a && a.rel && handlers[a.rel] ) {
				return a;
			}
			
		}
		
		return false;

	}

	function parseNode( n ) {
		
		var rel 	= n.getAttribute("rel"),
			href 	= n.getAttribute("href"),
			t		= null,
			index 	= href.indexOf("#"),
			id 		= index < 0 ? false : href.substr( index + 1 );

		if ( id!==false ) {
			t = document.getElementById( id );
		}

		var o = { 
			n		: n,
			rel		: rel,
			id		: id,
			target	: t
		};

		return o;

	}

	function init() {

		/**
		 * To protect stupid developers, mobile devices seem to still implement
		 * a mousedown/up event-stack on top of touchstart/end. Since I won't
		 * trust the bastards to keep this up I've implemented race-condition
		 * checks.
		 * As the above mentioned doesn't appear to happen simultaneously I've
		 * had to set the delay to 150 milliseconds. At this speed my test-devices
		 * did not register ghost-clicks and the responsiveness was acceptable.
		 */

		/**
		 * touch method will set touchTime, everytime it gets hit.
		 */
		var ft = function( e ) {
			touchTime = new Date().getTime();
			handleStart( e );
		};

		/**
		 * mouse method will check against touchTime. In the unlikely edge-case
		 * a use switches from touch to mouse the delay is set to a safe 500
		 * milliseconds, which should be short enough not to miss a click from
		 * user switching input devices :)
		 */
		var fm = function( e ) {
			var now = new Date().getTime();
			if ( now - touchTime > 500 ) {
				handleStart( e );
			}
		}

		var LinkListenerClick = events.attach( body, "mousedown", fm );

		var LinkListenerTouch = events.attach( body, "touchstart", ft );

	}

	var publicInterface = {

			addHandler: function( action, handler ) {
				handlers[ action ] = handler;
			},
			debug: function( eventsOverride ) {
				console.debug(this);
				this.eventsOrigin = events;
				events = eventsOverride;
				init();
			},
			endDebug: function() {
				reset();
				touchTime = 0;
				events = this.eventsOrigin;
			}

	};

	init();

	return publicInterface;

} )( window, document, Events );