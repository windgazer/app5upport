/* global requestAnimationFrame, RSVP */
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
 * @depends rAF.js
 * @depends points.js
 * @depends RSVP.js
 */
var Interactions = ( function( ) {
    "use strict";

    var EVENTS = {
            DOWN: "PointerDown",
            UP: "PointerUp",
            MOVE: "PointerMove"
        },
        Interactions = {
            
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
        scrollVertical = ( function( ) {
            var valid = true,
                isTracking,
                startY,
                isVert,
                i
            ;
            
            function reset() {
                if (i-- > 0) {
                    requestAnimationFrame(reset);
                } else {
                    isTracking = false;
                }
            }
            
            function start( e ) {
                startY = getY();

                isVert = isVertical( e );
                valid = isVert;

                i = 2;
                isTracking = true;
                return valid;
            }
            
            function isVertical( e ) {
                var vertical = true;
                //Some hackeridoo to figure this out between WebKit / Mozilla
                if ( typeof e.axis === "undefined" ) {
                    vertical = Math.abs( e.wheelDeltaY ) > Math.abs( e.wheelDeltaX );
                } else {
                    vertical = e.axis > 1;
                }
                return vertical;
            }
            
            function setClass( up ) {
                if ( up && addClass( "drawerTopRevealed" ) ) {
                    Interactions.trigger( "drawertop" );
                } else if ( !up && addClass( "drawerBottomRevealed" ) ) {
                    Interactions.trigger( "drawerbottom" );
                }
            }
            
            function getY( ) {
                return (window.pageYOffset !== undefined) ?
                        window.pageYOffset :
                        (
                            document.documentElement ||
                            document.body.parentNode ||
                            document.body
                        ).scrollTop
                ;
            }
            
            function track( e ) {
                var wheelData, up,
                    y = getY()
                ;
                // Check for max tresh-hold (so as not to create too
                // long of a buffer)
                // Add and check against 0 (to make sure there is a
                // buffer)
                // Check if still valid (so as not to waste time
                // calculating useless info)
                if ( i < 4 && (i = i + 2) > 0 && valid ) {
                    wheelData = e.detail ? e.detail * -1 : e.wheelDeltaY / 10;
                    up = wheelData > 0;
                    valid = valid && Math.abs(wheelData) > 0 && y == startY;
                    if ( i > 2 && valid ) {
                        setClass( up );
                    }
                }
            }

            return {
                track: function( e1 ) {
                    var e = e1.params||e1;
                    if (!isTracking) {
                        start( e );
                        reset();
                    } else {
                        track( e );
                    }
                    return valid;
                },
                isTriggered: function( e ) {
                    return valid;
                }
            };
        }( ) ),
        scrollHorizontal = ( function( ) {
            var valid = true,
                isTracking,
                startX,
                i
            ;
            
            function reset() {
                if (i-- > 0) {
                    requestAnimationFrame(reset);
                } else {
                    isTracking = false;
                }
            }

            function start( e ) {
                startX = getX();

                valid = !isVertical( e );

                i = 2;
                isTracking = true;
                return valid;
            }
            
            function setClass( wheeldata ) {
                if ( wheeldata > 0 && addClass( "drawerLeftRevealed" )) {
                    Interactions.trigger( "drawerleft" );
                    valid = false;
                } else if ( wheeldata < 0 && addClass( "drawerRightRevealed" )) {
                    Interactions.trigger( "drawerright" );
                    valid = false;
                }
            }
            
            function isVertical( e ) {
                var vertical = true;
                //Some hackeridoo to figure this out between WebKit / Mozilla
                if ( typeof e.axis === "undefined" ) {
                    vertical = Math.abs( e.wheelDeltaY ) > Math.abs( e.wheelDeltaX );
                } else {
                    vertical = e.axis > 1;
                }
                return vertical;
            }
            
            function getX() {
                return (window.pageXOffset !== undefined) ?
                        window.pageXOffset :
                        (
                            document.documentElement ||
                            document.body.parentNode ||
                            document.body
                        ).scrollLeft
                ;
            }
            
            function track( e ) {
                var wheelData, left,
                    x = getX()
                ;
                
                if ( valid && isVertical( e ) ) {
                    valid = false;
                }
                // Check for max tresh-hold (so as not to create too
                // long of a buffer)
                // Add and check against 0 (to make sure there is a
                // buffer)
                // Check if still valid (so as not to waste time
                // calculating useless info)
                if ( i < 6 && (i = i + 2) > 0 && valid ) {
                    //Carefull, could not write test, but e.wheelDelta will take the
                    //e.wheelDeltaY value when it is measurable, this can cause false
                    //left-swipe when swiping slightly up and right, always use
                    //wheelDeltaX when working with horizontal scrolling!!
                    wheelData = e.detail ? e.detail * -1 : e.wheelDeltaX / 10;
                    valid = valid && Math.abs(wheelData) > 0;
                    if ( i > 4 && valid ) {
                        setClass( wheelData );
                    }
                }
            }

            return {
                track: function( e1 ) {
                    var wheelData,
                        e = e1.params||e1,
                        isVert = isVertical( e )
                    ;
                    if (!isTracking) {
                        start( e );
                        reset();
                    } else {
                        track( e );
                    }
                    return valid;
                },
                isTriggered: function( e ) {
                    return valid;
                }
            };
        }( ) ),
        classes = []
    ;
    
    RSVP.EventTarget.mixin( Interactions );
    
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
        var b = getBody();
        if ( b.classList.contains( cls ) ) {
            return false;
        }
        clearClasses();
        b.classList.add( cls );
        classes.push( cls );
        return true;
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
            Interactions.trigger( "drawertop" );
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
        scrollVertical.track( e );
        scrollHorizontal.track( e );
    }

    function init() {
        addListener( EVENTS.DOWN, startTrackingGestures );
        //cancel mouse-wheel, can't do unit-test for it.
        window.addEventListener( "mousewheel", function( e ) {
            e.preventDefault();
            return false;
        } );
        window.addEventListener( "mousewheel", trackScrollGestures );
        window.addEventListener( "DOMMouseScroll", trackScrollGestures );
    }

    window.addEventListener( "load", init );

    return Interactions;

}( ) );