(function(){

	var	HELPER_ID = "WGD_Resolutions_Helper",
		helper = null;

	/**
	 * Resolutions is a helper class that will attempt to auto-detect what type/size
	 * screen is available and setup classes accordingly. Also will calculate the font
	 * size based on this which, combined with 'em' settings for dimensions of the UI
	 * should allow for a smoothly resizing application.
	 * 
	 * This version will still rely on my own Events class for setting up events, future
	 * implementation will be adapted to detect a subset of well-known alternatives such
	 * as jQuery and Prototype.
	 * 
	 * @author Martin "Windgazer" Reurings
	 * @class
	 * @requires Events
	 */
	var Resolutions = {
		RESOLUTION_LANDSCAPE : 4,
		RESOLUTION_PORTAIT: 2,
		// Device resolutions. Can be used for device-specific customization.
		RESOLUTION_UNDEFINED : 1,
		RESOLUTION_QVGA : 16,  // 320x240
		RESOLUTION_QVGA_LANDSCAPE : 4+16,  // 320x240
		RESOLUTION_QVGA_PORTRAIT : 2+16,   // 240x320
		RESOLUTION_NHD : 32,   // 640x360
		RESOLUTION_NHD_LANDSCAPE : 4+32,   // 640x360
		RESOLUTION_NHD_PORTRAIT : 2+32,    // 360x640
		RESOLUTION_HOME_SCREEN : 8,     // less than 75 % of the resolutions above
	
		resolution:1,
	
		resizeHandler:Events.attach(window, "resize", function() {
			Resolutions.screenSetup();
		}),
	
		loadHandler:Events.attach(window, "load", function() {
			helper = document.getElementById( HELPER_ID );
			if (!helper) {
				helper = document.createElement("div");
				helper.id = this.HELPER_ID;
				
				helper.style.width="100%";
				helper.style.height="100%";
				helper.style.position="absolute";
				helper.style.top="0";
				helper.style.left="0";
				helper.style.visibility="hidden";
		
				var body = document.getElementsByTagName("body")[0];
				body.appendChild(helper);
			}

			//Timeout to allow above helper div to resolve.
			window.setTimeout(function(){Resolutions.screenSetup();},0);
		}),
	
		/**
		 * The setup routine that calculates what screen-format we're at :)
		 */
		screenSetup:function() {
			var self = this;

			var size = Resolutions.getShortSize();
			var fontSize = Math.round(size.min / 24); //24 is a magic number that appears to work well for no apparent reason :)
			Resolutions.setOrientation(size.landscape?"landscape":"portrait");
			document.getElementsByTagName("body")[0].style.fontSize = fontSize + "px";
		},
	
		/**
		 * Gets the shortest side of the screen
		 */	
		getShortSize:function() {
			var width = screen.width;
			var height = screen.height;
			if (width==240||width==320||width==360||width==640) {
				//Skipping width/height guesstimations for some known presets.
				//Guesstimation fails on most mobile devices unfortunately.
			} else {
				width = helper.clientWidth||document.body.innerWidth;
				height = helper.clientHeight||document.body.innerHeight;
			}
			var min = Math.min(width,height);
			return {min:min,landscape:min!=width};
		},
	
		/**
		 * Private shortcut to set the orientation of the screen as a
		 * class-name on the body.
		 */
		setOrientation:function(orientation) {
			var body = document.getElementsByTagName("body")[0];
			body.className = body.className.replace(/ ?orientation_[^ ]+/,"") + " orientation_" + orientation;
		}
	
	}

})();