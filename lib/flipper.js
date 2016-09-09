/**
 * @author Luiz Filipe Machado Barni (odahcam) <luiz@odahcam.com>
 *
 * @param {object} $
 * @param {object} window
 * @param {object} document
 * @param {undefined} undefined
 * @returns {undefined}
 */
;
(function($, window, document, undefined) {

    "use strict";

    if (!$) {
        console.error("jQuery não encontrado, seu plugin jQuery não irá funcionar.");
        return false;
    }

    /**
     * Store the plugin name in a variable. It helps you if later decide to
     * change the plugin's name
     * @type {String}
     */
    var pluginName = 'flipper',
        defaults = { // default options
            defaultOption: "I'm a default option"
        };


    /**
     * The plugin constructor
     * @param {DOM Element} element The DOM element where plugin is applied
     * @param {Object} options Options passed to the constructor
     */
    function Plugin(element, options) {

        // stores the plugin name O_O
        this._name = pluginName;

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set the instance options extending the plugin defaults and
        // the options passed by the user

        /*
         * jQuery has an extend method which merges the contents of two or
         * more objects, storing the result in the first object. The first object
         * is generally empty as we don't want to alter the default options for
         * future instances of the plugin.
         *
         * @example
         * var options = {
         *    elem: "#someElementID",
         *    size: {
         *        width: 0,
         *        height: 0
         *    }
         * }
         *
         * $.extend(true, {}, defaults, options);
         *
         * The example above will recursive merge the defaults and options of the plugin.
         */
        this.settings = $.extend(false, {}, $.fn[pluginName].defaults, options, this.$el.data());

        // Initialize the plugin instance
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        /**
         * Initialize the plugin instance.
         * Set any other attribtes, store any other element reference, register
         * listeners, etc
         *
         * When bind listerners remember to name tag it with your plugin's name.
         * Elements can have more than one listener attached to the same event
         * so you need to tag it to unbind the appropriate listener on destroy:
         *
         * @example
         * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
         *
         *
         * You already have access to the DOM element and the options via the
         * instance.
         *
         * @example this.element; this.settings;
         *
         * You can add more functions like the one below and call them.
         *
         * @example this.yourOtherFunction("jQuery Boilerplate");
         *
         */
        init: function() {

        },
        yourOtherFunction: function(text) {

            // some logic
            $(this.el).text(text);
        },
        /**
         * The 'destroy' method is were you free the resources used by your plugin:
         * references, unregister listeners, etc.
         *
         * Remember to unbind for your event:
         *
         * @example
         * this.$someSubElement.off('.' + pluginName);
         *
         * Above example will remove any listener from your plugin for on the given
         * element.
         */
        destroy: function() {

            // Remove any attached data from your plugin
            this.$el.removeData();
        },
        /**
         * Write public methods within the plugin's prototype. They can
         * be called with:
         *
         * @example
         * $('#element').jqueryPlugin('somePublicMethod','Arguments', 'Here', 1001);
         *
         * @param  {[type]} foo [some parameter]
         * @param  {[type]} bar [some other parameter]
         * @return {[type]}
         */
        somePublicMethod: function(foo, bar) {

            // This is a call to a real private method. You need to use 'call' or 'apply'
            privateMethod.call(this);
        }
    });


    /**
     * Private methods
     */

    // Processes classes
    function dec(methods, args) {
        if (!args[0] || typeof(args[0]) == 'object')
            return methods.init.apply(this, args);
        else if (methods[args[0]] !== undefined)
            return methods[args[0]].apply(this, Array.prototype.slice.call(args, 1)); // Array.prototype.slice will convert the arguments object
        else
            throw turnError('"' + args[0] + '" is not a method or property.');
        return false;
    }


    // Attributes for a layer
    function divStyle(top, left, zIndex, overf) {
        return {
            'css': {
                position: 'absolute',
                top: top,
                left: left,
                'overflow': overf || 'hidden',
                zIndex: zIndex || 'auto'
            }
        };

    }

    // Gets a 2D point from a bezier curve of four points

    function bezier(p1, p2, p3, p4, t) {

        var a = 1 - t,
            b = a * a * a,
            c = t * t * t;

        return point2D(Math.round(b * p1.x + 3 * t * a * a * p2.x + 3 * t * t * a * p3.x + c * p4.x),
            Math.round(b * p1.y + 3 * t * a * a * p2.y + 3 * t * t * a * p3.y + c * p4.y));

    }

    // Converts an angle from degrees to radians

    function rad(degrees) {

        return degrees / 180 * PI;

    }

    // Converts an angle from radians to degrees

    function deg(radians) {

        return radians / PI * 180;

    }

    // Gets a 2D point

    function point2D(x, y) {

        return {
            x: x,
            y: y
        };

    }

    // Webkit 534.3 on Android wrongly repaints elements that use overflow:hidden + rotation

    function rotationAvailable() {
        var parts = /AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent);

        if (parts) {
            return parseFloat(parts[1]) > 534.3; // parseFloat = webkitVersion;
        } else {
            return true;
        }
    }

    // Returns the traslate value

    function translate(x, y, use3d) {

        return has3d && use3d ? ' translate3d(' + x + 'px,' + y + 'px, 0px) ' : ' translate(' + x + 'px, ' + y + 'px) ';

    }

    // Returns the rotation value

    function rotate(degrees) {
        return ' rotate(' + degrees + 'deg) ';
    }

    // Checks if a property belongs to an object

    function has(property, object) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }

    // Gets the CSS3 vendor prefix

    function getPrefix() {

        var vendorPrefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
            len = vendorPrefixes.length,
            vendor = '';

        while (len--)
            if ((vendorPrefixes[len] + 'Transform') in document.body.style)
                vendor = '-' + vendorPrefixes[len].toLowerCase() + '-';

        return vendor;

    }

    // Detects the transitionEnd Event

    function getTransitionEnd() {

        var t,
            el = document.createElement('fakeelement'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MSTransition': 'transitionend',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    // Gradients
    function gradient($elem, p0, p1, colors, numColors) {

        var j, cols = [];

        if (vendor == '-webkit-') {

            for (j = 0; j < numColors; j++)
                cols.push('color-stop(' + colors[j][0] + ', ' + colors[j][1] + ')');

            $elem.css({
                'background-image': '-webkit-gradient(linear, ' +
                    p0.x + '% ' +
                    p0.y + '%,' +
                    p1.x + '% ' +
                    p1.y + '%, ' +
                    cols.join(',') + ' )'
            });
        } else {
            p0 = {
                x: p0.x / 100 * $elem.width(),
                y: p0.y / 100 * $elem.height()
            };
            p1 = {
                x: p1.x / 100 * $elem.width(),
                y: p1.y / 100 * $elem.height()
            };

            var dx = p1.x - p0.x,
                dy = p1.y - p0.y,
                angle = Math.atan2(dy, dx),
                angle2 = angle - Math.PI / 2,
                diagonal = Math.abs($elem.width() * Math.sin(angle2)) + Math.abs($elem.height() * Math.cos(angle2)),
                gradientDiagonal = Math.sqrt(dy * dy + dx * dx),
                corner = point2D((p1.x < p0.x) ? $elem.width() : 0, (p1.y < p0.y) ? $elem.height() : 0),
                slope = Math.tan(angle),
                inverse = -1 / slope,
                x = (inverse * corner.x - corner.y - slope * p0.x + p0.y) / (inverse - slope),
                c = {
                    x: x,
                    y: inverse * x - inverse * corner.x + corner.y
                },
                segA = (Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)));

            for (j = 0; j < numColors; j++)
                cols.push(' ' + colors[j][1] + ' ' + ((segA + gradientDiagonal * colors[j][0]) * 100 / diagonal) + '%');

            $elem.css({
                'background-image': vendor + 'linear-gradient(' + (-angle) + 'rad,' + cols.join(',') + ')'
            });
        }
    }


    // Triggers an event
    function trigger(eventName, context, args) {
        var event = $.Event(eventName);
        context.trigger(event, args);
        if (event.isDefaultPrevented())
            return 'prevented';
        else if (event.isPropagationStopped())
            return 'stopped';
        else
            return '';
    }

    // JS Errors
    function turnError(message) {
        console.error(message);
    }

    // Request an animation
    window.requestAnim = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();


    /**
     * @description
     * This is were we register our plugin withint jQuery plugins.
     * It is a plugin wrapper around the constructor and prevents agains multiple
     * plugin instantiation (soteing a plugin reference within the element's data).
     *
     * @example
     * $('#element').flipper();
     */
    $.fn[pluginName] = function(options) {
        if (options === undefined || typeof options === 'object') {
            /*
             * Creates a new plugin instance, for each selected element, and
             * stores a reference withint the element's data
             */
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options !== 'init') {
            /*
             * Call a public plugin method for each selected element and returns this to not break chainbility.
             */
            return this.each(function() {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    var args = arguments;
                    instance[options].apply(instance, Array.prototype.slice.call(args, 1)); // Array.prototype.slice will convert the arguments object passed by .call()
                }
            });
        }
    };
})(window.jQuery || false, window, document);
