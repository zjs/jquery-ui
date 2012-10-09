/*!
 * jQuery UI Progressbar @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/progressbar/
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	version: "@VERSION",
	options: {
		value: 0,
		max: 100
	},

	min: 0,

	_create: function() {
		var val = this._value();
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.min,
				"aria-valuemax": this.options.max
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'><div></div></div>" )
			.appendTo( this.element );

		this.oldValue = this._value();
		this._refreshValue();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "value" || key === "animation" ) {
			this.options[ key ] = value;
			this._refreshValue();
			if ( this._value() === this.options.max ) {
				this._trigger( "complete" );
			}
		}

		this._super( key, value );
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" && val !== false ) {
			val = 0;
		} else if( val === false ) {
			val = NaN;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		var val = this._value();
		return isNaN( val ) ? 100 : 100 * val / this.options.max;
	},

	_refreshValue: function() {
		var value = this.value(),
			percentage = this._percentage(),
			overlay = this.valueDiv.children().eq( 0 );

		if ( this._hasAnimationSupport() ) {
			this.valueDiv.toggleClass( "ui-progressbar-animated-light", this.element.is( ".ui-progressbar-animated-light" ) );
			this.valueDiv.toggleClass( "ui-progressbar-animated-dark", this.element.is( ".ui-progressbar-animated-dark" ) );
		} else {
			overlay.toggleClass( "ui-progressbar-overlay", this.element.is( "[class*='ui-progressbar-animated-']" ) );
			overlay.toggleClass( "ui-progressbar-animated-light", this.element.is( ".ui-progressbar-animated-light" ) );
			overlay.toggleClass( "ui-progressbar-animated-dark", this.element.is( ".ui-progressbar-animated-dark" ) );
		}

		if ( this.oldValue !== value && ( !isNaN( this.oldValue ) || !isNaN( value ) ) ) {
			this.oldValue = value;
			this._trigger( "change" );
		}

		this.valueDiv
			.toggle( isNaN( value ) || value > this.min )
			.toggleClass( "ui-corner-right", value === this.options.max )
			.width( percentage.toFixed(0) + "%" );
		if ( isNaN( value ) ) {
			this.element.removeAttr( "aria-valuenow" );
		} else {
			this.element.attr( "aria-valuenow", value );
		}
	},

	_hasAnimationSupport: function() {
		// Adapted from MDN test https://developer.mozilla.org/en-US/docs/CSS/CSS_animations/Detecting_CSS_animation_support
		if ( this.element[ 0 ].style.animationName ) {
			return true;
		}

		var domPrefixes = "Webkit Moz O ms Khtml".split( " " ),
			i;
		for( i = 0; i < domPrefixes.length; i++ ) {
			if( this.element[ 0 ].style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
				return true;
			}
		}

		return false;
	}
});

})( jQuery );
