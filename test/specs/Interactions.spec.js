describe( "Interactions", function( ) {

    //RequestAnimationFrame polyfill
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    //Convenient Event Creation
    var eventHacks = ( function() {
        var pointerEventProperties = 'screenX screenY clientX clientY relatedTarget'.split( ' ' ),
            basicEvent, i, createUIEvent;

        basicEvent = {};
        i = pointerEventProperties.length;
        while (i--) {
            basicEvent[pointerEventProperties[i]] = -1;
        }

        // Can we create events using the MouseEvent constructor? If so, gravy
        try {
            i = new UIEvent( 'test' );

            createUIEvent = function ( type, bubbles ) {
                return new UIEvent( type, { view: window, bubbles: bubbles });
            };

        // otherwise we need to do things oldschool
        } catch ( err ) {
            if ( document.createEvent ) {
                createUIEvent = function ( type, bubbles ) {
                    var pointerEvent = document.createEvent( 'UIEvents' );
                    pointerEvent.initUIEvent( type, bubbles, true, window );

                    return pointerEvent;
                };
            }
        }

        if ( !createUIEvent ) {
            throw new Error( 'Cannot create events. You may be using an unsupported browser.' );
        }
        
        return {
            getBasicEvent: function( type, noBubble, params ) {
                var pointerEvent, i, param, value;

                pointerEvent = createUIEvent( type, !noBubble );

                i = pointerEventProperties.length;
                while ( i-- ) {
                    param = pointerEventProperties[i];
                    value = typeof params[param] !== "undefined"?params[param]:basicEvent[param];
                    
                    Object.defineProperty( pointerEvent, param, {
                        value: value,
                        writable: false
                    });
                }

                Object.defineProperty( pointerEvent, 'preventDefault', {
                    value: function(){},
                    writable: false
                });
                
                pointerEvent.target = {};

                return pointerEvent;
            }
        }
        
    }() );

    describe( "top-drawer", function( ) {

        var getBody = ( function() {
                var b = null;
                
                return function() {
                    if ( b === null ) {
                        b = document.body;
                    }
                    return b;
                }
            }()),
            down, m1, m2, m3, up,
            cycle = function() {
                switch ( ++i ) {
                case 5:
                    getBody().dispatchEvent( down );
                    break;
    
                case 10:
                    getBody().dispatchEvent( m1 );
                    break;
    
                case 15:
                    getBody().dispatchEvent( m2 );
                    break;
    
                case 20:
                    getBody().dispatchEvent( m3 );
                    break;
    
                case 25:
                    getBody().dispatchEvent( up );
                    break;
    
                default:
                    break;
                }
                
                if ( i < 25 ) {
                    requestAnimationFrame( cycle );
                } else {
                    finished = true;
                }
            },
    
            i, finished, test
        ;

        beforeEach( function( ) {

            i = 0;
            finished = false;

        } );

        it( "trigger on top-edge and down swipe", function( ) {

            down = eventHacks.getBasicEvent( "pointerdown", false, { clientX:10,clientY:1 } );
            m1 = eventHacks.getBasicEvent( "pointermove", false, { clientX:10,clientY:10 } );
            m2 = eventHacks.getBasicEvent( "pointermove", false, { clientX:10,clientY:20 } );
            m3 = eventHacks.getBasicEvent( "pointermove", false, { clientX:10,clientY:30 } );
            up = eventHacks.getBasicEvent( "pointerup", false, { clientX:10,clientY:40 } );

            //Actual test and such is running in AfterEach
            test = function() {
                expect( getBody( ).classList.contains("drawerTopRevealed") ).toBe( true );
            };
            
        } );

        it( "doesn't trigger on down swipe below 15 pixels from top", function( ) {

            down = eventHacks.getBasicEvent( "pointerdown", false, { clientX:10,clientY:16 } );
            m1 = eventHacks.getBasicEvent( "pointermove", false, { clientX:10,clientY:60 } );
            m2 = eventHacks.getBasicEvent( "pointermove", false, { clientX:10,clientY:70 } );
            m3 = eventHacks.getBasicEvent( "pointermove", false, { clientX:10,clientY:80 } );
            up = eventHacks.getBasicEvent( "pointerup", false, { clientX:10,clientY:90 } );

            //Actual test and such is running in AfterEach
            test = function() {
                expect( getBody( ).classList.contains("drawerTopRevealed") ).toBe( false );
            };

        } );

        it( "doesn't trigger on down swipe with angle of 35degrees or more", function( ) {

            down = eventHacks.getBasicEvent( "pointerdown", false, { clientX:10,clientY:0 } );
            up = eventHacks.getBasicEvent( "pointerup", false, { clientX:56,clientY:90 } );

            //Actual test and such is running in AfterEach
            test = function() {
                expect( getBody( ).classList.contains("drawerTopRevealed") ).toBe( false );
            };

        } );

        it( "clears drawerTopRevealed when any pointerdown event occurs", function( ) {
            
            down = eventHacks.getBasicEvent( "pointerdown", false, { clientX:50,clientY:0 } );
            m1 = eventHacks.getBasicEvent( "pointermove", false, { clientX:50,clientY:70 } );
            m2 = eventHacks.getBasicEvent( "pointerup", false, { clientX:50,clientY:90 } );
            m3 = eventHacks.getBasicEvent( "pointerdown", false, { clientX:10,clientY:60 } );
            up = eventHacks.getBasicEvent( "pointerup", false, { clientX:50,clientY:90 } );

            //Actual test and such is running in AfterEach
            test = function() {
                expect( getBody( ).classList.contains("drawerTopRevealed") ).toBe( false );
            };

        } );
        
        afterEach( function( ) {
            runs( function( ) {
                
                cycle( );
    
            } );
    
            waitsFor( function( ) {
    
                return finished;
    
            }, "interaction to finish", 1500 );
           
            runs( function( ) {

                test();
                getBody().classList.remove("drawerTopRevealed");

            } );
        });

    } );

} );