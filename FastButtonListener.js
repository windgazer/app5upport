/*! app5upport - v0.0.7 - 2013-08-29 */var FastButtonListener=function(a,b,c){function d(a){var a=a||event,b=a.target||a.srcElement,c=h(b);if(l===!1&&c!==!1){l=c;var d=function(a){e(a)};p=events.attach(n,"touchend",d),q=events.attach(n,"mouseup",d)}}function e(a){if(l!==!1){var a=a||event,b=a.target||a.srcElement;l&&l.n===b&&f(a),l=!1,g()}return events.cancel(a)}function f(){o[l.rel](l)}function g(){q&&(events.detach(q),q=!1),p&&(events.detach(p),p=!1)}function h(a){if(k.test(a.nodeName)){var b=i(a);if(b&&b.rel&&o[b.rel])return b}return!1}function i(a){var c=a.getAttribute("rel"),d=a.getAttribute("href"),e=null,f=d.indexOf("#"),g=0>f?!1:d.substr(f+1);g!==!1&&(e=b.getElementById(g));var h={n:a,rel:c,id:g,target:e};return h}function j(){var a=function(a){m=(new Date).getTime(),d(a)},b=function(a){var b=(new Date).getTime();b-m>500&&d(a)};events.attach(n,"mousedown",b),events.attach(n,"touchstart",a)}var k=/^a$/i,l=!1,m=0,n=b.documentElement||b.body,o={},p=!1,q=!1;events=c;var r={addHandler:function(a,b){o[a]=b},debug:function(a){console.debug(this),this.eventsOrigin=events,events=a,j()},endDebug:function(){g(),m=0,events=this.eventsOrigin}};return j(),r}(window,document,Events);