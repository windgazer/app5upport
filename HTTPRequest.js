var HTTPRequest = (function() {
	
	var changeHandler = function( request ) {
		var httpRequest = request.httpRequest;
		// Completed httpRequest
		if (httpRequest.readyState==4) {
			// Switch status values
			if (request.handlers[httpRequest.status]) request.handlers[httpRequest.status](request);
			else console.error("Error: 48877378378." + httpRequest.status + "\nMissing status handler for XMLHttpRequest.");
		}
	};

	/**
	 * 
	 * @author Martin 'Windgazer' Reurings
	 * @version 2.0.121207
	 * @constructor
	 */
	function HttpRequestWrapper( onSuccess, debug ) {

		this.debug = debug?true:false;
		this.handlers = {};
		this.handlers[0] = typeof onSuccess !== "undefined"? onSuccess: function ( requestWrapper ) {
			console.error( "File-system return code is 0 and currently not handled!!", requestWrapper );
		};
		this.handlers[200] = typeof onSuccess !== "undefined"? onSuccess: function ( requestWrapper ) {
			console.error( "Default success readystate of 200 should be handled!!!", requestWrapper );
		};

		//create the httprequest object, first in conditional IE statement, then for the compliant browsers.
		//Code adapted from: http://jibbering.com/2002/4/httprequest.html
		this.httpRequest=false;
		/*@cc_on @*/
		/*@if (@_jscript_version >= 5)
		// JScript gives us Conditional compilation, we can cope with old IE versions.
		// and security blocked creation of the objects.
		 try {
		  this.httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		 } catch (e) {
		  try {
		   this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		  } catch (E) {
		   this.httpRequest = false;
		  }
		 }
		@end @*/
		if (!this.httpRequest && typeof XMLHttpRequest!='undefined') {
		  this.httpRequest = new XMLHttpRequest();
		}

		if (this.httpRequest!=false) { //We have an accual httprequest object
			var self = this;
			//Adding a handler for statechanges
			this.httpRequest.onreadystatechange=function() {
				changeHandler(self);
			}
		}
	
	}
	
	HttpRequestWrapper.prototype = {
		/**
		 * Just a little shortcut, I always think of canceling.
		 * The official method is abort...
		 */
		cancel: function() {
			this.httpRequest.abort();
		},
		/**
		 * A convenience method to open a request. Will show a debug message
		 * if so indicated upon creation of a new wrapper.
		 * @private
		 */
		openRequest: function(request, url, threaded) {
				if (this.debug)  this.httpRequest.open(request,prompt("Request url",url),threaded);
				else this.httpRequest.open(request,url,threaded);
		},
		/**
		 * A convenience method to send a request.Will first open the request
		 * and subsequently send the content.
		 * @private
		 */
		sendRequest: function(request, url, threaded, content, customHeaders) {
			this.openRequest(request, url, threaded);
			if (customHeaders) {
				for(var i = 0; i < customHeaders.length; i++) {
					var header = customHeaders[i];
					this.httpRequest.setRequestHeader(header.name,header.value);
				}
			}
			this.httpRequest.send(content);
		},
		/**
		 * A convenience method to get a request. This is a non-threaded method
		 * and not advisable for everyday use...
		 * If null is provided as content it will perform a "GET" request,
		 * otherwise it will perform a "POST" request.
		 * @private
		 */
		getRequest: function(url, target, content) {
			if (this.httpRequest!=false) {
				this.target = target;
				var request = content==null?"GET":"POST";
				this.sendRequest(request,url,false,content); //Don't use a handler, non-threaded, browser will freeze until response is received in full.
				if (debug) alert(httpRequest.getAllHeaders() + "\nResponse size: " + httpRequest.responseText.length);
			}
		},
		/**
		 * This method is intended for use of posting a form.
		 * When completed this method will read the form, encode it's name/value
		 * pairs and post it to the url indicated by the action attribute. This
		 * is for all intends and purposes a true 'POST' request and the server-side
		 * code will not be able to distinguish it from a conventional 'POST'
		 * request unless additional precautions are taken.
		 * This method is incapable of handling file-uploads, such elements are
		 * excluded from javascript access (this is a security measure).
		 * @param {Form} form A Form object that you wish to post unobtrusively...
		 */
		doPostForm: function(form) {
			if (this.httpRequest!=false) {
				this.target = form;
				var request = form.method;
				var url = form.action;
				var content = ""
				//Create routine to fill content with post values...
				//Create the 'content' for the request
				var content = "";
				for (var i = 0; i < form.elements.length; i++) {
					var element = form.elements[i];
					var name = element.id||element.name;
					if (name) {
						var value = FormHelper.getValue(element);
						if (value) {
							if (content.length > 0) content += ",";
							content+=name;
							content+="=";
							content+=escape(value);
						}
					}
				}
				//Send a 'POST' request.
				this.doPost(form.action, form, content);
				alert("This method has not been implemented properly, currently no data is accually posted!");
			}
		},
		/**
		 * This method performs a 'POST' request. It's a threaded request.
		 * This is the default httprequest taken by a browser when it
		 * sends form-information to the server. This method should be
		 * used for request that alter data on the server.
		 * @param {String} url The url you wish post to.
		 * @param {Object} target An object that is bound to this request. This is a convenience way to toss some extra info to your handler.
		 * @param {String} content The content of the post-request.
		 */
		doPost: function(url, target, content) {
			this.doRequest(
				url,
				"POST",
				target,
				content,
				new Array({name:"Content-Type",value:"application/x-www-form-urlencoded"})
			);
		},
		/**
		 * This method performs a 'GET' request. It's a threaded request.
		 * This is the default httprequest taken by a browser when it
		 * tries to open a URL. This method should be used for requests
		 * that serve to get 'static' information from the server.
		 * @param {String} url The url you wish send a request to.
		 * @param {Object} target An object that is bound to this request. This is a convenience way to toss some extra info to your handler.
		 */
		doGet: function(url, target) {
			this.doRequest(url, "GET", target, null);
		},
		/**
		 * This method performs a 'HEAD' request. It's a threaded request.
		 * This is a very common request, used by browsers to check if
		 * they need to load the url, or if they can serve the cached version
		 * of it. This request doesn't actually return the contents of 
		 * the url, it only returns the headers.
		 * Another common header used from this would be "Content-Type", used
		 * to determine what to show the url with (or whether to download it
		 * and save it instead...)
		 * Here's an example to get to the headers:
		 * 
		 * 	var RequestHandler = function(requestWrapper) {
				var target = requestWrapper.target;
				// if xmlhttp shows "loaded"
				if (requestWrapper.httpRequest.readyState==4) {
					// Switch status values
					switch (requestWrapper.httpRequest.status) {
						case 200: alert(requestWrapper.httpRequest.getResponseHeader("Content-Type") + " " + requestWrapper.target.foo);
							break;
						case 0: alert("Filesystem handling has been disabled.");
							break;
						default: alert("Problem retrieving XML data: " + requestWrapper.httpRequest.status);
					}
				}
			};
			var wrapper = new HttpRequestWrapper(RequestHandler, false);
			wrapper.doHead("http://www.microsoft.com",{foo:"bar",hello:"world"});
		 * 
		 * @param {String} url The url you wish send a request to.
		 * @param {Object} target An object that is bound to this request. This is a convenience way to toss some extra info to your handler.
		 */
		doHead: function(url, target) {
			this.doRequest(url, "HEAD", target, null);
		},
		/**
		 * This method performs a request of your chosen type. It's a threaded request.
		 * The most common type of request is "GET", the second-most common is "POST".
		 * However, there are many more valid types (like "DELETE", "MOVE", etc...)
		 * @param {String} url The url you wish send a request to.
		 * @param {String} request The request method, common methods include 'GET', 'POST' and 'HEAD'.
		 * @param {Object} target An object that is bound to this request. This is a convenience way to toss some extra info to your handler.
		 * @param {String} content The content of the post-request.
		 */
		doRequest:function(url, request, target, content, customHeaders) {
			if (this.httpRequest!=false) {
				this.target = target;
				this.sendRequest(request,url,true,content, customHeaders);
			}
		},
		/**
		 * This method returns XML. This is a non-threaded request, it is
		 * not advisable to use this as it will freeze the user=interface
		 * until the request has fully arrived.
		 * If null is provided as content it will perform a "GET" request,
		 * otherwise it will perform a "POST" request.
		 * @param {String} url The url you wish send a request to.
		 * @param {Object} target An object that is bound to this request. This is a convenience way to toss some extra info to your handler.
		 * @param {String} content The content of the 'POST'-request, or null for a 'GET'-request.
		 */
		getXML: function(url, target, content) {
			if (this.httpRequest!=false) {
				this.getRequest(url, target, content);
				return this.httpRequest.responseXML;
			}
		},
		/**
		 * This method returns Text. This is a non-threaded request, it is
		 * not advisable to use this as it will freeze the user=interface
		 * until the request has fully arrived.
		 * If null is provided as content it will perform a "GET" request,
		 * otherwise it will perform a "POST" request.
		 * @param {String} url The url you wish send a request to.
		 * @param {Object} target An object that is bound to this request. This is a convenience way to toss some extra info to your handler.
		 * @param {String} content The content of the 'POST'-request, or null for a 'GET'-request.
		 */
		getText: function(url, target, content) {
			if (this.httpRequest!=false) {
				this.getRequest(url, target, content);
				return this.httpRequest.responseText;
			}
		},
		/**
		 * Add a status handler to this RequestHandler.
		 * Use this method to enable the handler to
		 * handle additional status results. A common
		 * result to handler would be 404, file not
		 * found.
		 * 
		 * @param {int} requestStatus The number of the status you want to handle (0 is filesystem, 200 is success, 404 is file not found)
		 * @param {function} handler A function taking the HttpRequestWrapper as a parameter.
		 */
		addHandler: function( requestStatus, handler ) {
			this.handlers[requestStatus]=handler;
		}
	}
	
	formHelpers = {
		"input": function(element) {
			return formHelpers[element.type]?formHelpers[element.type](element):element.value;
		},
		"select": function(element) {
			return element[element.selectedIndex].value;
		},
		"textarea": function(element) {
			return element.value;
		},
		"checkbox": function(element) {
			return element.checked?element.value:null;
		},
		"radio": function(element) {
			return element.checked?element.value:null;
		}
	};
	
	var FormHelper = {
		getValue:function(element) {
			var nodeName = element.nodeName.toLowerCase();
			return formHelpers[nodeName]?formHelpers[nodeName](element):null;
		}
	}

	return HttpRequestWrapper;

})();
