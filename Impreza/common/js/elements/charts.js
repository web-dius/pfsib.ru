/**
 * Reinitialize VC Charts on usMaybeUpdateCharts event
 */
! function( $ ) {
	"use strict";

	$us.USVCCharts = function( container, options ) {
		this.init( container, options );
	};

	$us.USVCCharts.prototype = {
		init: function( container, options ) {
			this.$container = $( container );

			this.charts = {
				line: {
					class: 'vc_line-chart',
				},
				round: {
					class: 'vc_round-chart',
				}
			};

			// Lister for the event to redraw the chart
			$us.$canvas.on( 'contentChange', this.redraw.bind( this ) );
		},

		redraw: function( event, data = {} ) {
			if ( !data || ! data.elm ) {
				return;
			}

			for ( const chart in this.charts ) {
				const $wrapper = $( data.elm ).hasClass( 'w-popup' ) ? '.w-popup-wrap' : $( data.elm );

				if ( this.$container.closest( $wrapper ).length ) {
					if ( this.$container.hasClass( this.charts.line.class ) ) {
						$.fn.vcLineChart && this.$container.vcLineChart( { reload: ! 1 } );
					} else if ( this.$container.hasClass( this.charts.round.class ) ) {
						$.fn.vcRoundChart && this.$container.vcRoundChart( { reload: ! 1 } );
					}
				}
			}
		},
	};

	$.fn.USVCCharts = function( options ) {
		return this.each( function() {
			$( this ).data( 'USVCCharts', new $us.USVCCharts( this, options ) );
		} );
	};

	$( function() {
		$( '.vc_line-chart, .vc_round-chart' ).USVCCharts();
	} );
}( jQuery );