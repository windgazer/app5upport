/* global RSVP, HTTPRequest, a5s */
window.a5s = typeof window.a5s == "undefined" ? {} : window.a5s;

/**
 * 
 * @singleton
 * @class
 * @requires HTTPRequest.js
 * @requires CustomEvents.js
 */
var ClassTemplate = ( function( domain ) {
    "use strict";

    var uidI = 0,
        templates = {},
        re = /\${([^}]+)}/gi,
        tempTemplate = "<article id=\"${id}\">Loading...</article>",
        loaders = {}
    ;

    /**
     * Get the template path for a 'type' based on an equally named script
     * resource.
     * 
     * @argument {String} type
     * @return {String} url returns null of script is not found
     */
    function getTemplatePath( type ) {

        var scripts = document.getElementsByTagName( "script" ),
            l = scripts.length,
            i = l,
            re = new RegExp( "^(.*/)" + type + ".js\\b.*$", "i" ),
            s, url, m, templateUrl
        ;

        for (i; i--;) {

            s = scripts[i];
            url = s.src;
            m = url.match( re );

            if (m) {

                templateUrl = m[1] + type + ".html";
                return templateUrl;

            }

        }

        return null;

    }

    var helper = {

        /**
         * Attempt to load an html-template into memory based on the type of a
         * 'component'. This method expects the file name to match the type and
         * the template to reside in the same directory as well as having the
         * same filename (with an html extension instead of js...)
         */
        loadTemplate : function( type ) {

            var tmpl = this.getTemplate( type ),
                loader = loaders[type],
                url, that, request
            ;

            if (tmpl === null && typeof loader === "undefined") {

                loader = new RSVP.Promise( );
                url = getTemplatePath( type );

                that = this;
                request = new HTTPRequest( false );

                that.trigger( "template.queued", {
                    type : type,
                    url : url
                } );
                request
                    .doGet( url )
                    .then(
                        function( e ) {

                            // console.log( "HTTPRequest is finished
                            // :)", that, loader );
                            var wrapper = e.request,
                                txt = wrapper.httpRequest.responseText
                            ;

                            that.addTemplate( type, txt );
                            that.trigger( "template.finished", {
                                type : type,
                                template : txt
                            } );
                            loader.trigger( "template.finished", {
                                type : type,
                                template : txt
                            } );
                            loader.resolve( {
                                type : type,
                                template : txt
                            } );
                            delete loaders[type];

                        }
                    )
                ;

                loaders[type] = loader;

            }

            return loader;

        },

        /**
         * Render a template with 'values' into 'node'.
         * 
         */
        renderTemplate : function( templateName, values, node, epromise ) {

            var t = ClassTemplate.getTemplate( templateName ),
                loader = loaders[templateName],
                promise = epromise || new RSVP.Promise( )
            ;

            if (t === null) {

                if (!loader) {
                    loader = this.loadTemplate( templateName );
                }

                // Setup delayed rendering...
                // Setup handler to wait for template...
                loader.on( "template.finished", function( e ) {

                    ClassTemplate.renderTemplate( templateName, values, node,
                            promise );
                    loader.resolve( );

                } );

                // Set temporary template
                t = tempTemplate;

            } else {

                promise.resolve( {
                    node : node
                } );

            }

            if (node) {

                node.innerHTML = ClassTemplate.fillTemplate( t, values );

            } else {
                throw "No target-node specified!!!";
            }

            return promise;

        },

        addTemplate : function( type, template ) {

            templates[type] = template;

        },

        getTemplate : function( type ) {

            return templates[type] ? templates[type] : null;

        },

        /**
         * Fill a template with the provided values. Values van be encoded into
         * template as ${value} markers.
         * 
         * @argument {String} template The type of the template as string
         * @argument {JSON} values A JSON object of the values to be used
         */
        fillTemplate : function( template, values ) {

            var o = "", m = null, preIndex = 0;

            while ( m = re.exec( template ) ) {

                var v = values[m[1]];
                v = typeof v !== "undefined" ? v : m[1];
                o += RegExp.leftContext.substr( preIndex ) + v;
                preIndex = re.lastIndex;

            }

            if (o.length <= 0) {
                return template;
            }

            o += RegExp.rightContext;

            return o;

        }

    };

    if (window.unittesting) {
        var cachedtemplates = null;

        helper.reset = function( ) {
            if (cachedtemplates === null) {
                cachedtemplates = templates;
            }

            templates = {};

            for ( var k in cachedtemplates) {
                templates[k] = cachedtemplates[k];
            }
        };
    }

    RSVP.EventTarget.mixin( helper );

    return helper;

} )( a5s );
