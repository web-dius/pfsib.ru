jQuery( function( $ ) {
	"use strict";
	/* Ultimate Addons for WPBakery Page Builder integration */
	jQuery( '.upb_bg_img, .upb_color, .upb_grad, .upb_content_iframe, .upb_content_video, .upb_no_bg' ).each( function() {
		var $bg = jQuery( this ),
			$prev = $bg.prev();

		if ( $prev.length == 0 ) {
			var $parent = $bg.parent(),
				$parentParent = $parent.parent(),
				$prevParentParent = $parentParent.prev();

			if ( $prevParentParent.length ) {
				$bg.insertAfter( $prevParentParent );

				if ( $parent.children().length == 0 ) {
					$parentParent.remove();
				}
			}
		}
	} );
	$( '.g-cols > .ult-item-wrap' ).each( function( index, elm ) {
		var $elm = jQuery( elm );
		$elm.replaceWith( $elm.children() );
	} );
	jQuery( '.overlay-show' ).click( function() {
		window.setTimeout( function() {
			$us.$canvas.trigger( 'contentChange' );
		}, 1000 );
	} );
} );
