/**
 * Interactions is a module that will watch for pointer-events and on certain
 * well-known 'gestures' is will trigger some classes on the document body.
 * 
 * CSS can be created to react to these class-changes in order to make use of
 * these gestures. In near-future implementations it may also get some 
 * javascript based controls to have more fine-grained control.
 * 
 * [Points.js](https://github.com/Rich-Harris/Points) has been chosen as a
 * viable polyfill for pointerevents and in time should no longer be a
 * requirement as browsers implement a viable support.
 * 
 * @depends points.js
 */
( function( ) {
    "use strict";

    var EVENTS = {
            DOWN: "PointerDown",
            UP: "PointerUp",
            MOVE: "PointerMove"
        },
        getBody = ( function() {
            var b = null;
            
            return function() {
                if ( b === null ) {
                    b = document.body;
                }
                return b;
            };
        }()),
        swipeDown = ( function( ) {
            var valid = true,
                start
            ;

            return {
                start: function( e ) {
                    valid = e.clientY < 16;
                    start = e;
                    return valid;
                },
                track: function( e ) {
                    if (valid) {
                        valid = start.clientY < e.clientY;
                    }
                    return valid;
                },
                isTriggered: function( e ) {
                    var h, w;
                    if (valid) {
                        h = e.clientY - start.clientY;
                        w = Math.abs( e.clientX - start.clientX );
                        
                        valid = h > 35 && (w === 0 || h/w > 2);
                    }
                    return valid;
                }
            };
        }( ) ),
        scrollUp = ( function( ) {
            var valid = true,
                isVertical,
                isTracking,
                start,
                i
            ;
            
            function reset() {
                if (i-- > 0) {
                    requestAnimationFrame(reset);
                } else {
                    console.log('finished tracking');
                    isTracking = false;
                }
            }

            return {
                start: function( e1 ) {
                    var y = (window.pageYOffset !== undefined) ?
                            window.pageYOffset :
                            (
                                document.documentElement ||
                                document.body.parentNode ||
                                document.body
                            ).scrollTop,
                        e = e1.params||e1
                    ;

                    //Some hackeridoo to figure this out between WebKit / Mozilla
                    if ( typeof e.axis === "undefined" ) {
                        isVertical = Math.abs( e.wheelDeltaY ) > Math.abs( e.wheelDeltaX );
                    } else {
                        isVertical = e.axis > 1;
                    }

                    valid = y <= 0 && isVertical;

                    start = e;
                    i = 2;
                    isTracking = true;
                    console.log("starting", valid);
                    return valid;
                },
                track: function( e1 ) {
                    var wheelData,
                        e = e1.params||e1
                    ;
                    if (!isTracking) {
                        this.start( e );
                        reset();
                    } else {
                        console.log("Verifying", valid, i);
                        //Check for max tresh-hold (so as not to create too long of a buffer)
                        //Add and check against 0 (to make sure there is a buffer)
                        //Check if still valid (so as not to waste time calculating useless info)
                        if ( i < 4 && (i = i + 2) > 0 && valid ) {
                            wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 10;
                            valid = valid && wheelData > 0;
                            if ( i > 2 && valid ) {
                                addClass( "drawerTopRevealed" );
                            }
                        }
                    }
                    return valid;
                },
                isTriggered: function( e ) {
                    var h, w;
                    if (valid) {
                        h = e.clientY - start.clientY;
                        w = Math.abs( e.clientX - start.clientX );
                        
                        valid = h > 35 && (w === 0 || h/w > 2);
                    }
                    return valid;
                }
            };
        }( ) ),
        classes = []
    ;
    
    function genericListenerMethod( type, method, add ) {
        var b = getBody(),
            lMethod = add?"addEventListener":"removeEventListener"
        ;

        b[lMethod]( type.toLowerCase(), method );
        b[lMethod]( "MS" + type, method );
    }

    function addListener( type, method ) {

        genericListenerMethod( type, method, true );

    }

    function removeListener( type, method ) {

        genericListenerMethod( type, method, false );

    }
    
    function addClass( cls ) {
        getBody( ).classList.add( cls );
        classes.push( cls );
    }
    
    function clearClasses() {
        var cls,
            b = getBody()
        ;

        while (cls = classes.pop()) { //jshint ignore:line
            b.classList.remove( cls );
        }
    }

    function trackGestures( e ) {        
        swipeDown.track( e );
    }

    function stopTrackingGestures( e ) {
        if (swipeDown.isTriggered( e )) {
            addClass( "drawerTopRevealed" );
        }
        removeListener( EVENTS.MOVE, trackGestures );
        removeListener( EVENTS.UP, stopTrackingGestures );
    }

    function startTrackingGestures( e ) {
        var b = getBody( );

        clearClasses();
        swipeDown.start( e );
        addListener( EVENTS.MOVE, trackGestures );
        addListener( EVENTS.UP, stopTrackingGestures );
    }

    function trackScrollGestures( e ) {
        scrollUp.track( e );
    }

    function init() {
        addListener( EVENTS.DOWN, startTrackingGestures );
        window.addEventListener( "mousewheel", trackScrollGestures );
        window.addEventListener( "DOMMouseScroll", trackScrollGestures );
    }

    window.addEventListener( "load", init );

}( ) );