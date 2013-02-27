describe("FastButtonListener", function() {
	
	var fakeEvents = (function() {
		
		var handlers = {};

		var pubInterface = {

				attach: function( n, type, method ) {
					var ta = handlers[type];
					if (!ta) {
						ta = new Array();
						handlers[type] = ta;
					}
					var ev = {n:n,f:method}; 
					ta.push( ev );
					return {n:n,t:type,m:method,ev:ev};
				},

				detach:function(wrapper) {
					var ta = handlers[wrapper.type];
					if (ta) {
						for (var i = 0; i < ta.length; i++) {
							var temp = ta[i];
							if (temp === wrapper.ev) {
								ta[i] = {n:n,f:function(){}};
							}
						}
					}
				},

				fire: function( type, n, x, y ) {
					var stop = false;
					var ta = handlers[ type ],
						e = {
							target: n,
							cancel: function(){
								stop = true;
							},
							touches: [{clientX:x,clientY:y}]
						};
					if ( ta ) {
						for ( var i = 0; !stop && i < ta.length; i++ ) {
							ta[i].f( e );
						}
					}
				},
				
				cancel: function(e) {
					e.cancel();
					return false;
				},

				clear: function() {
					handlers = {};
				}

		};
		
		return pubInterface;

	})();
	
	var fakeElement = (function(){
		var attribs = {
				"rel"	: "testAction",
				"href"	: ""
		};
		
		return {
			nodeName:"a",
			getAttribute: function( att ) {
				return attribs[att];
			}
		}
	})();
	
	beforeEach( function() {
		FastButtonListener.debug( fakeEvents );
	});
	
	afterEach( function() {
		FastButtonListener.endDebug(  );
		fakeEvents.clear();
	})

	it("should not react on a click event",function(){
		var called = false;
		FastButtonListener.addHandler("testAction", function() {
			called = true;
		});
		
		fakeEvents.fire( "click", fakeElement, 0, 0 );
		expect(called).toBe(false);
	});

	it("should react on a touchstart/end sequence without moving",function(){
		var called = false;
		FastButtonListener.addHandler("testAction",function() {
			called = true;
		});

		fakeEvents.fire( "touchstart", fakeElement, 10, 10 );
		fakeEvents.fire( "touchend", fakeElement, 10, 10 );

		expect(called).toBe(true);
	});

	it("should react on a mousedown/up sequence without moving",function(){
		var called = false;
		FastButtonListener.addHandler("testAction",function() {
			called = true;
		});

		fakeEvents.fire( "mousedown", fakeElement, 10, 10 );
		fakeEvents.fire( "mouseup", fakeElement, 10, 10 );

		expect(called).toBe(true);
	});

	it("should not react on a touchend after a touchstart/end sequence",function(){
		var called = 0;
		FastButtonListener.addHandler("testAction",function() {
			called++;
		});

		fakeEvents.fire( "touchstart", fakeElement, 10, 10 );
		fakeEvents.fire( "touchend", fakeElement, 10, 10 );
		fakeEvents.fire( "touchend", fakeElement, 10, 10 );

		expect(called).toBe(1);
		
	});

	it("should not react on a mouseup after a touchstart/end sequence",function(){
		var called = 0;
		FastButtonListener.addHandler("testAction",function() {
			called++;
		});

		fakeEvents.fire( "touchstart", fakeElement, 10, 10 );
		fakeEvents.fire( "touchend", fakeElement, 10, 10 );
		fakeEvents.fire( "mouseup", fakeElement, 10, 10 );

		expect(called).toBe(1);
		
	});

	it("should react on a second touchstart/end sequence without delay",function(){
		var called = 0;
		FastButtonListener.addHandler("testAction",function() {
			called++;
		});

		fakeEvents.fire( "touchstart", fakeElement, 10, 10 );
		fakeEvents.fire( "touchend", fakeElement, 10, 10 );
		
		expect(called).toBe(1);

		fakeEvents.fire( "touchstart", fakeElement, 10, 10 );
		fakeEvents.fire( "touchend", fakeElement, 10, 10 );
		
		expect(called).toBe(2);
	});

});
