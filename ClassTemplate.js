window.a5s = typeof window.a5s == "undefined"? {}: window.a5s;

/**
 * @requires HTTPRequest.js
 * @requires CustomEvents.js
 */
var ClassTemplate = ( function( domain ) {

	var uidI       = 0,
	    queue      = {},
	    templates  = {},
		types      = {},
		re         = /\${([^}]+)}/gi;

	helper = {

			/**
			 * Attempt to load an html-template into memory based on the
			 * type of a 'component'. This method expects the file name
			 * to match the type and the template to reside in the same
			 * directory as well as having the same filename (with an
			 * html extension instead of js...)
			 */
			loadTemplate : function( type ) {

				var scripts = document.getElementsByTagName("script"),
					l = scripts.length,
					i = l,
					re = new RegExp("^(.*/)" + type + ".js\\b.*$", "i");
				
				for (i; i--; ) {
		
					var s = scripts[i];
					var url = s.src;
					var m = url.match( re );
					
					if ( m ) {
		
						var templateUrl = m[1] + type + ".html";

						if ( typeof templates[ type ] === "undefined"
							 && typeof queue[ templateUrl ] === "undefined" ) {

							var that = this;
							var request = new HTTPRequest( function( wrapper ) {

								var txt = wrapper.httpRequest.responseText;
								delete queue[ templateUrl ];
								that.addTemplate( type, txt );
								ce.fireEvent("template.finished", {type: type, template: txt});

							}, false );

							queue[ templateUrl ] = request;
							ce.fireEvent( "template.queued", {type: type, url: templateUrl} );
							request.doGet( templateUrl );

						}
		
					}
		
				}

			},
			
			addTemplate : function( type, template ) {

				templates[ type ] = template;

			},
			
			getTemplate : function( type ) {

				return templates[ type ]?templates[ type ]:null;

			},
			
			fillTemplate : function( template, values ) {

				var o = "",
				    m = null,
				    preIndex = 0;

				while (m = re.exec(template)) {

				    var v = values[m[1]];
					v = typeof v!=="undefined"?v:m[1];
					o += RegExp.leftContext.substr(preIndex) + v;
					preIndex = re.lastIndex;

				}

				o += RegExp.rightContext;

				return o;
			},
			
			addType: function( type, object ) {

				types[ type ] = object;

			},
			
			getType: function( type ) {

				return types[ type ];

			}
			
	};
	
	if ( window.unittesting ) {
	    var cachedtemplates = null;

	    helper.reset = function(  ) {
	        if ( cachedtemplates === null ) {
	            cachedtemplates = templates;
	        }
	        
	        templates = {};
	        queue = {};

	        for ( var k in cachedtemplates ) {
	            templates[ k ] = cachedtemplate[ k ];
	        }
	    }
	}

	return helper;

})( a5s );
