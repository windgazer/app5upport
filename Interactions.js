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
                start, current, end
            ;

            return {
                start: function( e ) {
                    valid = e.clientY < 51;
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
                    if (valid) {
                        var h = e.clientY - start.clientY,
                            w = Math.abs( e.clientX - start.clientX )
                        ;

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

    function init() {
        addListener( EVENTS.DOWN, startTrackingGestures );
    }

    window.addEventListener( "load", init );

}( ) );