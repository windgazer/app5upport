/*! app5upport - v0.0.7 - 2013-08-29 */window.a5s="undefined"==typeof window.a5s?{}:window.a5s;var ClassTemplate=function(){function a(a){var b=document.getElementsByTagName("script"),c=b.length,d=c,e=new RegExp("^(.*/)"+a+".js\\b.*$","i");for(d;d--;){var f=b[d],g=f.src,h=g.match(e);if(h){var i=h[1]+a+".html";return i}}return null}var b={},c=/\${([^}]+)}/gi,d='<article id="${id}">Loading...</article>',e={};if(helper={loadTemplate:function(b){var c=this.getTemplate(b),d=e[b];if(null===c&&"undefined"==typeof d){d=new RSVP.Promise;var f=a(b),g=this,h=new HTTPRequest(!1);g.trigger("template.queued",{type:b,url:f}),h.doGet(f).then(function(a){var c=a.request,f=c.httpRequest.responseText;g.addTemplate(b,f),g.trigger("template.finished",{type:b,template:f}),d.trigger("template.finished",{type:b,template:f}),d.resolve({type:b,template:f}),delete e[b]}),e[b]=d}return d},renderTemplate:function(a,b,c,f){var g=ClassTemplate.getTemplate(a),h=e[a],f=f||new RSVP.Promise;if(null===g?(h||(h=this.loadTemplate(a)),h.on("template.finished",function(){ClassTemplate.renderTemplate(a,b,c,f),h.resolve()}),g=d):f.resolve({node:c}),!c)throw"No target-node specified!!!";return c.innerHTML=ClassTemplate.fillTemplate(g,b),f},addTemplate:function(a,c){b[a]=c},getTemplate:function(a){return b[a]?b[a]:null},fillTemplate:function(a,b){for(var d="",e=null,f=0;e=c.exec(a);){var g=b[e[1]];g="undefined"!=typeof g?g:e[1],d+=RegExp.leftContext.substr(f)+g,f=c.lastIndex}return d.length<=0?a:d+=RegExp.rightContext}},window.unittesting){var f=null;helper.reset=function(){null===f&&(f=b),b={};for(var a in f)b[a]=cachedtemplate[a]}}return RSVP.EventTarget.mixin(helper),helper}(a5s);