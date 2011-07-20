/*
* jQuery Mobile Framework : "selectmenu" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function( $, undefined ) {

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( "select:not(:jqmData(role='slider'))", e.target )
		.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
		.selectmenu();
});

$.widget( "mobile.selectmenu", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		icon: "arrow-d",
		iconpos: "right",
		inline: null,
		corners: true,
		shadow: true,
		iconshadow: true
	},
	_create: function() {

		var self = this,

			o = this.options,

			select = this.element
						.wrap( "<div class='ui-select'>" ),

			selectID = select.attr( "id" ),

			label = $( "label[for='"+ selectID +"']" ).addClass( "ui-select" ),

			// IE throws an exception at options.item() function when
			// there is no selected item
			// select first in this case
			selectedIndex = select[ 0 ].selectedIndex == -1 ? 0 : select[ 0 ].selectedIndex,

			button = 	$( "<div/>" )
				.text( $( select[ 0 ].options.item( selectedIndex ) ).text() )
				.insertBefore( select )
				.buttonMarkup({
					theme: o.theme,
					icon: o.icon,
					iconpos: o.iconpos,
					inline: o.inline,
					corners: o.corners,
					shadow: o.shadow,
					iconshadow: o.iconshadow
				}),

			// Multi select or not
			isMultiple = self.isMultiple = select[ 0 ].multiple;

		// Opera does not properly support opacity on select elements
		// In Mini, it hides the element, but not its text
		// On the desktop,it seems to do the opposite
		// for these reasons, using the nativeMenu option results in a full native select in Opera
		if ( o.nativeMenu && window.opera && window.opera.version ) {
			select.addClass( "ui-select-nativeonly" );
		}		

		// Add counter for multi selects
		if ( isMultiple ) {
			self.buttonCount = $( "<span>" )
				.addClass( "ui-li-count ui-btn-up-c ui-btn-corner-all" )
				.hide()
				.appendTo( button );
		}

		// Disable if specified
		if ( o.disabled ) {
			this.disable();
		}

		// Events on native select
		select.change(function() {
			self.refresh();
		});

		// Expose to other methods
		$.extend( self, {
			select: select,
			selectID: selectID,
			label: label,
			button: button			
		});

		select.appendTo( button )
			.bind( "vmousedown", function() {
				// Add active class to button
				button.addClass( $.mobile.activeBtnClass );
			})
			.bind( "focus vmouseover", function() {
				button.trigger( "vmouseover" );
			})
			.bind( "vmousemove", function() {
				// Remove active class on scroll/touchmove
				button.removeClass( $.mobile.activeBtnClass );
			})
			.bind( "change blur vmouseout", function() {

				button.trigger( "vmouseout" )
					.removeClass( $.mobile.activeBtnClass );
			});
	},

	refresh: function( forceRebuild ) {
		var self = this,
			select = this.element,
			isMultiple = this.isMultiple,
			options = this.optionElems = select.find( "option" ),
			selected = options.filter( ":selected" ),

			// return an array of all selected index's
			indicies = selected.map(function() {
				return options.index( this );
			}).get();

		self.button.find( ".ui-btn-text" )
			.text(function() {

				if ( !isMultiple ) {
					return selected.text();
				}

				return selected.map(function() {
								return $( this ).text();
							}).get().join( ", " );
			});

		// multiple count inside button
		if ( isMultiple ) {
			self.buttonCount[ selected.length > 1 ? "show" : "hide" ]().text( selected.length );
		}
	},

	disable: function() {
		this.element.attr( "disabled", true );
		this.button.addClass( "ui-disabled" ).attr( "aria-disabled", true );
		return this._setOption( "disabled", true );
	},

	enable: function() {
		this.element.attr( "disabled", false );
		this.button.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
		return this._setOption( "disabled", false );
	}
});
})( jQuery );

