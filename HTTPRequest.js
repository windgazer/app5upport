/*! app5upport - v0.0.9 - 2013-11-27 */var HTTPRequest=function(){"use strict";function a(a,b){var c=a.httpRequest;4==c.readyState&&b.resolve({status:c.status,request:a})}function b(b,c){b.httpRequest!==!1&&(b.httpRequest.onreadystatechange=function(){a(b,c)})}function c(a){this.debug=a?!0:!1,this.handlers={},this.httpRequest=!1,this.httpRequest||"undefined"==typeof XMLHttpRequest||(this.httpRequest=new XMLHttpRequest)}c.prototype={cancel:function(){this.httpRequest.abort()},openRequest:function(a,c,d){var e=new RSVP.Promise;return b(this,e),this.debug?this.httpRequest.open(a,prompt("Request url",c),d):this.httpRequest.open(a,c,d),e},sendRequest:function(a,b,c,d,e){var f,g,h=this.openRequest(a,b,c);if(e)for(f=0;f<e.length;f++)g=e[f],this.httpRequest.setRequestHeader(g.name,g.value);return this.httpRequest.send(d),h},getRequest:function(a,b,c){if(this.httpRequest!==!1){this.target=b;var d=null===c?"GET":"POST";return this.sendRequest(d,a,!1,c)}},doPostForm:function(a){var b,c,d,f,g,h,i="";if(this.httpRequest!==!1){for(this.target=a,b=a.method,c=a.action,d=0;d<a.elements.length;d++)f=a.elements[d],g=f.id||f.name,g&&(h=e.getValue(f),h&&(i.length>0&&(i+=","),i+=g,i+="=",i+=escape(h)));return alert("NYI, currently no data is accually posted!"),this.doPost(a.action,a,i)}},doPost:function(a,b,c){return this.doRequest(a,"POST",b,c,new Array({name:"Content-Type",value:"application/x-www-form-urlencoded"}))},doGet:function(a,b){return this.doRequest(a,"GET",b,null)},doHead:function(a,b){return this.doRequest(a,"HEAD",b,null)},doRequest:function(a,b,c,d,e){return this.httpRequest!==!1?(this.target=c,this.sendRequest(b,a,!0,d,e)):void 0},getXML:function(a,b,c){return this.httpRequest!==!1?(this.getRequest(a,b,c),this.httpRequest.responseXML):void 0},getText:function(a,b,c){return this.httpRequest!==!1?(this.getRequest(a,b,c),this.httpRequest.responseText):void 0},addHandler:function(){throw"No longer implemented, with support for Promise, please use .then( ... )"}};var d={input:function(a){return d[a.type]?d[a.type](a):a.value},select:function(a){return a[a.selectedIndex].value},textarea:function(a){return a.value},checkbox:function(a){return a.checked?a.value:null},radio:function(a){return a.checked?a.value:null}},e={getValue:function(a){var b=a.nodeName.toLowerCase();return d[b]?d[b](a):null}};return c}();