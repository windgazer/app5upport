/*! app5upport - v0.0.10 - 2014-02-16 */var FastButtonListener=function(a,b,c){"use strict";function d(a){var b=a||event,c=b.target||b.srcElement,d=h(c);if(l===!1&&d!==!1){l=d;var f=function(a){e(a)};p=r.attach(n,"touchend",f),q=r.attach(n,"mouseup",f)}}function e(a){var b=a||event,c=b.target||b.srcElement;return l!==!1&&(l&&l.n===c&&f(b),l=!1,g()),r.cancel(b)}function f(){o[l.rel](l)}function g(){q&&(r.detach(q),q=!1),p&&(r.detach(p),p=!1)}function h(a){if(k.test(a.nodeName)){var b=i(a);if(b&&b.rel&&o[b.rel])return b}return!1}function i(a){var c=a.getAttribute("rel"),d=a.getAttribute("href"),e=null,f=d.indexOf("#"),g=0>f?!1:d.substr(f+1);g!==!1&&(e=b.getElementById(g));var h={n:a,rel:c,id:g,target:e};return h}function j(){{var a=function(a){m=(new Date).getTime(),d(a)},b=function(a){var b=(new Date).getTime();b-m>500&&d(a)};r.attach(n,"mousedown",b),r.attach(n,"touchstart",a)}}var k=/^a$/i,l=!1,m=0,n=b.documentElement||b.body,o={},p=!1,q=!1,r=c,s={addHandler:function(a,b){o[a]=b},debug:function(a){console.debug(this),this.eventsOrigin=r,r=a,j()},endDebug:function(){g(),m=0,r=this.eventsOrigin}};return j(),s}(window,document,Events);