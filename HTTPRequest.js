/*! app5upport - v0.0.5 - 2013-04-20 */var HTTPRequest=function(){function e(e,t){var n=e.httpRequest;4==n.readyState&&t.resolve({status:n.status,request:e})}function t(t,n){0!=t.httpRequest&&(t.httpRequest.onreadystatechange=function(){e(t,n)})}function n(e){this.debug=e?!0:!1,this.handlers={},this.httpRequest=!1,this.httpRequest||"undefined"==typeof XMLHttpRequest||(this.httpRequest=new XMLHttpRequest)}n.prototype={cancel:function(){this.httpRequest.abort()},openRequest:function(e,n,r){var u=new RSVP.Promise;return t(this,u),this.debug?this.httpRequest.open(e,prompt("Request url",n),r):this.httpRequest.open(e,n,r),u},sendRequest:function(e,t,n,r,u){var s=this.openRequest(e,t,n);if(u)for(var a=0;u.length>a;a++){var i=u[a];this.httpRequest.setRequestHeader(i.name,i.value)}return this.httpRequest.send(r),s},getRequest:function(e,t,n){if(0!=this.httpRequest){this.target=t;var r=null==n?"GET":"POST";return this.sendRequest(r,e,!1,n)}},doPostForm:function(e){if(0!=this.httpRequest){this.target=e,e.method,e.action;for(var t="",t="",n=0;e.elements.length>n;n++){var u=e.elements[n],s=u.id||u.name;if(s){var a=r.getValue(u);a&&(t.length>0&&(t+=","),t+=s,t+="=",t+=escape(a))}}return alert("This method has not been implemented properly, currently no data is accually posted!"),this.doPost(e.action,e,t)}},doPost:function(e,t,n){return this.doRequest(e,"POST",t,n,Array({name:"Content-Type",value:"application/x-www-form-urlencoded"}))},doGet:function(e,t){return this.doRequest(e,"GET",t,null)},doHead:function(e,t){return this.doRequest(e,"HEAD",t,null)},doRequest:function(e,t,n,r,u){return 0!=this.httpRequest?(this.target=n,this.sendRequest(t,e,!0,r,u)):void 0},getXML:function(e,t,n){return 0!=this.httpRequest?(this.getRequest(e,t,n),this.httpRequest.responseXML):void 0},getText:function(e,t,n){return 0!=this.httpRequest?(this.getRequest(e,t,n),this.httpRequest.responseText):void 0},addHandler:function(){throw"No longer implemented, with support for Promise, please use .then( ... )"}},formHelpers={input:function(e){return formHelpers[e.type]?formHelpers[e.type](e):e.value},select:function(e){return e[e.selectedIndex].value},textarea:function(e){return e.value},checkbox:function(e){return e.checked?e.value:null},radio:function(e){return e.checked?e.value:null}};var r={getValue:function(e){var t=e.nodeName.toLowerCase();return formHelpers[t]?formHelpers[t](e):null}};return n}();