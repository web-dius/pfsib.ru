/**
 * UpSolution Element: Grid
 */
;( function( $, undefined ) {
	"use strict";

	var _undefined = undefined;

	$us.WGrid = function( container, options ) {
		this.init( container, options );
	};

	$us.WGrid.prototype = {
		init: function( container, options ) {
			// Elements
			this.$container = $( container );
			// Built-in filters.
			this.$filters = $( '.g-filters-item', this.$container );
			this.$items = $( '.w-grid-item', this.$container );
			this.$list = $( '.w-grid-list', this.$container );
			this.$loadmore = $( '.g-loadmore', this.$container );
			this.$pagination = $( '> .pagination', this.$container );
			this.$preloader = $( '.w-grid-preloader', this.$container );
			this.$style = $( '> style:first', this.$container );

			// Variables
			this.loading = false;
			this.changeUpdateState = false;
			this.gridFilter = null;

			this.curFilterTaxonomy = '';
			this.paginationType = this.$pagination.length
				? 'regular'
				: ( this.$loadmore.length ? 'ajax' : 'none' );
			this.filterTaxonomyName = this.$list.data( 'filter_taxonomy_name' )
				? this.$list.data( 'filter_taxonomy_name' )
				: 'category';

			// Prevent double init.
			if ( this.$container.data( 'gridInit' ) == 1 ) {
				return;
			}
			this.$container.data( 'gridInit', 1 );

			var $jsonContainer = $( '.w-grid-json', this.$container );
			if ( $jsonContainer.length && $jsonContainer.is( '[onclick]' ) ) {
				this.ajaxData = $jsonContainer[ 0 ].onclick() || {};
				this.ajaxUrl = this.ajaxData.ajax_url || '';
				// Delete data everywhere except for the preview of the USBuilder, the data may be needed again to restore the elements.
				if ( ! $us.usbPreview() ) $jsonContainer.remove();
				// In case JSON data container isn't present.
			} else {
				this.ajaxData = {};
				this.ajaxUrl = '';
			}

			this.carouselSettings = this.ajaxData.carousel_settings;
			this.breakpoints = this.ajaxData.carousel_breakpoints || {};

			if ( this.$list.hasClass( 'owl-carousel' ) ) {
				$us.getScript( $us.templateDirectoryUri + '/common/js/vendor/owl.carousel.js', function() {
					this.carouselOptions = {
						autoHeight: this.carouselSettings.autoHeight,
						autoplay: this.carouselSettings.autoplay,
						autoplayHoverPause: true,
						autoplayTimeout: this.carouselSettings.timeout,
						center: this.carouselSettings.center,
						dots: this.carouselSettings.dots,
						items: parseInt( this.carouselSettings.items ),
						loop: this.carouselSettings.loop,
						mouseDrag: ! jQuery.isMobile,
						nav: this.carouselSettings.nav,
						navElement: 'div',
						navText: ['', ''],
						responsive: {},
						rewind: ! this.carouselSettings.loop,
						rtl: $( '.l-body' ).hasClass( 'rtl' ),
						slideBy: this.carouselSettings.slideby,
						slideTransition: this.carouselSettings.transition,
						smartSpeed: this.carouselSettings.speed
					};

					if ( this.carouselSettings.smooth_play == 1 ) {
						this.carouselOptions.slideTransition = 'linear';
						this.carouselOptions.autoplaySpeed = this.carouselSettings.timeout;
						this.carouselOptions.smartSpeed = this.carouselSettings.timeout;
						this.carouselOptions.slideBy = 1;
					}

					if ( this.carouselSettings.carousel_fade ) {
						// https://owlcarousel2.github.io/OwlCarousel2/demos/animate.html
						$.extend( this.carouselOptions, {
							animateOut: 'fadeOut',
							animateIn: 'fadeIn',
						} );
					}

					// Writing responsive params in a loop to prevent json conversion bugs
					$.each( this.breakpoints, function( breakpointWidth, breakpointArgs ) {
						if ( breakpointArgs !== _undefined && breakpointArgs.items !== _undefined ) {
							this.carouselOptions.responsive[ breakpointWidth ] = breakpointArgs;
							// Making sure items value is an integer
							this.carouselOptions.responsive[ breakpointWidth ][ 'items' ] = parseInt( breakpointArgs.items );
						}
					}.bind( this ) );

					// Re-init containers with show more links or init tabs after carousel init.
					this.$list
						.on( 'initialized.owl.carousel', function( e ) {
							var $list = this.$list,
								$toggleLinks = $( '[data-content-height]', e.currentTarget );
							// Refresh for Toggle Links
							$toggleLinks.each( function( _, item ) {
								var $item = $( item ),
									collapsibleContent = $item.data( 'usCollapsibleContent' );
								// Initialization for items that are cloned
								if ( collapsibleContent === _undefined ) {
									$item.usCollapsibleContent();
									collapsibleContent = $item.data( 'usCollapsibleContent' );
								}
								if ( collapsibleContent instanceof $us.collapsibleContent ) {
									collapsibleContent.initHeightCheck();
									$us.timeout( function() {
										$list.trigger( 'refresh.owl.carousel' );
									}, 1 );
								}
							} );
							// Refresh for active tabs
							if ( $.isMobile && $list.closest( '.w-tabs-section.active' ).length ) {
								$us.timeout( function() {
									$list.trigger( 'refresh.owl.carousel' );
								}, 50 );
							}
							// Update auto height when content changes
							if ( this.carouselSettings.autoHeight ) {
								$toggleLinks.on( 'toggleContent', function() {
									$list.trigger( 'refresh.owl.carousel' );
								} );
							}
						}.bind( this ) )
						// Disabling mouse Drag if there is a toggle link.
						.on( 'mousedown.owl.core', function() {
							var $target = $( this );
							if ( $( '[data-content-height]', $target ).length && ! jQuery.isMobile ) {
								var owlCarousel = $target.data( 'owl.carousel' );
								owlCarousel.$stage.off( 'mousedown.owl.core' );
							}
						} );

					// https://owlcarousel2.github.io/OwlCarousel2/docs/started-welcome.html
					this.$list.owlCarousel( this.carouselOptions );

					var owlCarousel = this.$list.data( 'owl.carousel' );
					if ( owlCarousel && this.carouselSettings.smooth_play ) {
						this.$list.trigger( 'next.owl.carousel' );
					}

				}.bind( this ) );
			}

			if ( this.$container.hasClass( 'popup_page' ) ) {
				if ( this.ajaxData == _undefined ) {
					return;
				}

				this.lightboxTimer = null;
				this.$lightboxOverlay = this.$container.find( '.l-popup-overlay' );
				this.$lightboxWrap = this.$container.find( '.l-popup-wrap' );
				this.$lightboxBox = this.$container.find( '.l-popup-box' );
				this.$lightboxContent = this.$container.find( '.l-popup-box-content' );
				this.$lightboxContentPreloader = this.$lightboxContent.find( '.g-preloader' );
				this.$lightboxContentFrame = this.$container.find( '.l-popup-box-content-frame' );
				this.$lightboxNextArrow = this.$container.find( '.l-popup-arrow.to_next' );
				this.$lightboxPrevArrow = this.$container.find( '.l-popup-arrow.to_prev' );
				this.$container.find( '.l-popup-closer' ).click( function() {
					this.hideLightbox();
				}.bind( this ) );

				this.$container.find( '.l-popup-box' ).click( function() {
					this.hideLightbox();
				}.bind( this ) );
				this.$container.find( '.l-popup-box-content' ).click( function( e ) {
					e.stopPropagation();
				}.bind( this ) );
				this.originalURL = window.location.href;
				this.lightboxOpened = false;

				if ( this.$list.hasClass( 'owl-carousel' ) ) {
					$us.getScript( $us.templateDirectoryUri + '/common/js/vendor/owl.carousel.js', function() {
						this.initLightboxAnchors();
					}.bind( this ) );
				} else {
					this.initLightboxAnchors();
				}

				$( window ).on( 'resize', function() {
					if ( this.lightboxOpened && $us.$window.width() < $us.canvasOptions.disableEffectsWidth ) {
						this.hideLightbox();
					}
				}.bind( this ) );
			}

			if ( this.$list.hasClass( 'owl-carousel' ) ) {
				return;
			}

			if ( this.paginationType != 'none' || this.$filters.length ) {
				if ( this.ajaxData == _undefined ) {
					return;
				}

				this.templateVars = this.ajaxData.template_vars || {};
				if ( this.filterTaxonomyName ) {
					this.initialFilterTaxonomy = this.$list.data( 'filter_default_taxonomies' )
						? this.$list.data( 'filter_default_taxonomies' ).toString().split( ',' )
						: '';
					this.curFilterTaxonomy = this.initialFilterTaxonomy;
				}

				this.curPage = this.ajaxData.current_page || 1;
				this.infiniteScroll = this.ajaxData.infinite_scroll || 0;
			}

			if ( this.$container.hasClass( 'with_isotope' ) ) {
				$us.getScript( $us.templateDirectoryUri + '/common/js/vendor/isotope.js', function() {
					this.$list.imagesLoaded( function() {
						var smallestItemSelector,
							isotopeOptions = {
								itemSelector: '.w-grid-item',
								layoutMode: ( this.$container.hasClass( 'isotope_fit_rows' ) ) ? 'fitRows' : 'masonry',
								isOriginLeft: ! $( '.l-body' ).hasClass( 'rtl' ),
								transitionDuration: 0
							};

						if ( this.$list.find( '.size_1x1' ).length ) {
							smallestItemSelector = '.size_1x1';
						} else if ( this.$list.find( '.size_1x2' ).length ) {
							smallestItemSelector = '.size_1x2';
						} else if ( this.$list.find( '.size_2x1' ).length ) {
							smallestItemSelector = '.size_2x1';
						} else if ( this.$list.find( '.size_2x2' ).length ) {
							smallestItemSelector = '.size_2x2';
						}
						if ( smallestItemSelector ) {
							smallestItemSelector = smallestItemSelector || '.w-grid-item';
							isotopeOptions.masonry = { columnWidth: smallestItemSelector };
						}

						// Launching CSS animation locally after building elements in isotope.
						this.$list.on( 'layoutComplete', function() {
							if ( window.USAnimate ) {
								$( '.w-grid-item.off_autostart', this.$list )
									.removeClass( 'off_autostart' );
								new USAnimate( this.$list );
							}
							// Trigger scroll event to check the positions for $us.waypoints.
							$us.$window.trigger( 'scroll.waypoints' );
						}.bind( this ) );

						this.$list.isotope( isotopeOptions );

						if ( this.paginationType == 'ajax' ) {
							this.initAjaxPagination();
						}
						$us.$canvas.on( 'contentChange', function() {
							this.$list.imagesLoaded( function() {
								this.$list.isotope( 'layout' );
							}.bind( this ) );
						}.bind( this ) );

					}.bind( this ) );
				}.bind( this ) );
			} else if ( this.paginationType == 'ajax' ) {
				this.initAjaxPagination();
			}

			this.$filters.each( function( index, filter ) {
				var $filter = $( filter ),
					taxonomy = $filter.data( 'taxonomy' );
				$filter.on( 'click', function() {
					if ( taxonomy != this.curFilterTaxonomy ) {
						if ( this.loading ) {
							return;
						}
						this.setState( 1, taxonomy );
						this.$filters.removeClass( 'active' );
						$filter.addClass( 'active' );
					}
				}.bind( this ) )
			}.bind( this ) );

			// This is necessary for interaction from the Grid Filter or Grid Order.
			if ( this.$container.closest( '.l-main' ).length ) {
				$us.$body
					.on( 'us_grid.updateState', this._events.updateState.bind( this ) )
					.on( 'us_grid.updateOrderBy', this._events.updateOrderBy.bind( this ) );
			}

			// Add events
			this.$list
				.on( 'click', '[ref=magnificPopup]', this._events.initMagnificPopup.bind( this ) );
		},
		/**
		 * Event handlers
		 * @private
		 */
		_events: {
			/**
			 * Update Grid State.
			 *
			 * @param {Event} e
			 * @param {string} params String of parameters from filters for the grid.
			 * @param {number} page
			 * @param {object} gridFilter
			 */
			updateState: function( e, params, page, gridFilter ) {
				if (
					! this.$container.is( '[data-filterable="true"]' )
					|| ! this.$container.hasClass( 'used_by_grid_filter' )
				) {
					return;
				}

				page = page || 1;
				this.changeUpdateState = true;
				this.gridFilter = gridFilter;

				// Is load grid content
				if ( this.ajaxData === _undefined ) {
					this.ajaxData = {};
				}

				if ( ! this.hasOwnProperty( 'templateVars' ) ) {
					this.templateVars = this.ajaxData.template_vars || {
						query_args: {}
					};
				}
				this.templateVars.us_grid_filter_params = params;
				if ( this.templateVars.query_args !== false ) {
					this.templateVars.query_args.paged = page;
				}

				// Related parameters for getting data, number of records for taxonomy, price range for WooCommerce,
				// etc.
				this.templateVars.filters_args = gridFilter.filtersArgs || {};
				this.setState( page );

				// Reset pagination
				if ( this.paginationType === 'regular' && /page(=|\/)/.test( location.href ) ) {
					var url = location.href.replace( /(page(=|\/))(\d+)(\/?)/, '$1' + page + '$2' );
					history.replaceState( document.title, document.title, url );
				}
			},
			/**
			 * Update Grid orderby.
			 *
			 * @param {Event} e
			 * @param string orderby String for order by params.
			 * @param {number} page
			 * @param {object} gridOrder
			 */
			updateOrderBy: function( e, orderby, page, gridOrder ) {
				if (
					! this.$container.is( '[data-filterable="true"]' )
					|| ! this.$container.hasClass( 'used_by_grid_order' )
				) {
					return;
				}

				page = page || 1;
				this.changeUpdateState = true;
				if ( ! this.hasOwnProperty( 'templateVars' ) ) {
					this.templateVars = this.ajaxData.template_vars || {
						query_args: {}
					};
				}
				if ( this.templateVars.query_args !== false ) {
					this.templateVars.query_args.paged = page;
				}
				this.templateVars.grid_orderby = orderby;
				this.setState( page );
			},
			/**
			 * Initializing MagnificPopup for AJAX loaded items.
			 *
			 * @param {Event} e
			 */
			initMagnificPopup: function( e ) {
				e.stopPropagation();
				e.preventDefault();
				var $target = $( e.currentTarget );
				if ( $target.data( 'magnificPopup' ) === _undefined ) {
					$target.magnificPopup( {
						type: 'image',
						mainClass: 'mfp-fade'
					} );
					$target.trigger( 'click' );
				}
			}
		},
		initLightboxAnchors: function() {
			this.$anchors = this.$list.find( '.w-grid-item-anchor' );
			this.$anchors.on( 'click', function( e ) {
				var $clicked = $( e.target ),
					$item = $clicked.closest( '.w-grid-item' ),
					$anchor = $item.find( '.w-grid-item-anchor' ),
					itemUrl = $anchor.attr( 'href' );
				if ( ! $item.hasClass( 'custom-link' ) ) {
					if ( $us.$window.width() >= $us.canvasOptions.disableEffectsWidth ) {
						e.stopPropagation();
						e.preventDefault();
						this.openLightboxItem( itemUrl, $item );
					}
				}
			}.bind( this ) );
		},
		// Pagination and Filters functions.
		initAjaxPagination: function() {
			this.$loadmore.on( 'click', function() {
				if ( this.curPage < this.ajaxData.max_num_pages ) {
					this.setState( this.curPage + 1 );
				}
			}.bind( this ) );

			if ( this.infiniteScroll ) {
				$us.waypoints.add( this.$loadmore, '-70%', function() {
					if ( ! this.loading ) {
						this.$loadmore.click();
					}
				}.bind( this ) );
			}
		},
		setState: function( page, taxonomy ) {
			if ( this.loading && ! this.changeUpdateState ) {
				return;
			}

			if (
				page !== 1
				&& this.paginationType == 'ajax'
				&& this.none !== _undefined
				&& this.none == true
			) {
				return;
			}

			this.none = false;
			this.loading = true;

			// Hide element by default
			this.$container
				.next( '.w-grid-none' )
				.addClass( 'hidden' );

			// Create params for built-in filter
			if ( this.$filters.length && ! this.changeUpdateState ) {
				taxonomy = taxonomy || this.curFilterTaxonomy;
				if ( taxonomy == '*' ) {
					taxonomy = this.initialFilterTaxonomy;
				}

				if ( taxonomy != '' ) {
					var newTaxArgs = {
							'taxonomy': this.filterTaxonomyName,
							'field': 'slug',
							'terms': taxonomy
						},
						taxQueryFound = false;
					if ( this.templateVars.query_args.tax_query == _undefined ) {
						this.templateVars.query_args.tax_query = [];
					} else {
						$.each( this.templateVars.query_args.tax_query, function( index, taxArgs ) {
							if ( taxArgs != null && taxArgs.taxonomy == this.filterTaxonomyName ) {
								this.templateVars.query_args.tax_query[ index ] = newTaxArgs;
								taxQueryFound = true;
								return false;
							}
						}.bind( this ) );
					}
					if ( ! taxQueryFound ) {
						this.templateVars.query_args.tax_query.push( newTaxArgs );
					}
				} else if ( this.templateVars.query_args.tax_query != _undefined ) {
					$.each( this.templateVars.query_args.tax_query, function( index, taxArgs ) {
						if ( taxArgs != null && taxArgs.taxonomy == this.filterTaxonomyName ) {
							this.templateVars.query_args.tax_query[ index ] = null;
							return false;
						}
					}.bind( this ) );
				}
			}

			this.templateVars.query_args.paged = page;

			if ( this.paginationType == 'ajax' ) {
				if ( page == 1 ) {
					this.$loadmore.addClass( 'done' );
				} else {
					this.$loadmore.addClass( 'loading' );
				}
				if ( ! this.infiniteScroll ) {
					this.prevScrollTop = $us.$window.scrollTop();
				}
			}

			if ( this.paginationType != 'ajax' || page == 1 ) {
				this.$preloader.addClass( 'active' );
				if ( this.$list.data( 'isotope' ) ) {
					this.$list.isotope( 'remove', this.$container.find( '.w-grid-item' ) );
					this.$list.isotope( 'layout' );
				} else {
					this.$container.find( '.w-grid-item' ).remove();
				}
			}

			this.ajaxData.template_vars = JSON.stringify( this.templateVars );

			var isotope = this.$list.data( 'isotope' );
			// Clear isotope elements on first page load
			if ( isotope && page == 1 ) {
				this.$list.html( '' );
				isotope.remove( isotope.items );
				isotope.reloadItems();
			}

			// Abort prev request
			if ( this.xhr !== _undefined ) {
				this.xhr.abort();
			}

			this.xhr = $.ajax( {
				type: 'post',
				url: this.ajaxData.ajax_url,
				data: this.ajaxData,
				beforeSend: function() {
					// Display the grid before submitting the request
					this.$container
						.removeClass( 'no_results_hide_grid' );
				}.bind( this ),
				success: function( html ) {
					var $result = $( html ),
						// Note: Get the `first()` list since there may be several of them due to
						// the output of grids in `w-grid-none`
						$container = $( '.w-grid-list', $result ).first(),
						$pagination = $( '.pagination > *', $result ),
						$items = $container.children(),
						smallestItemSelector;

					// Hide the grid if there is no result if action 'Hide this Grid' is enabled
					this.$container
						.toggleClass( 'no_results_hide_grid', ! $items.length );

					$container.imagesLoaded( function() {
						this.beforeAppendItems( $items );
						//isotope.options.hiddenStyle.transform = '';
						$items.appendTo( this.$list );
						$container.html( '' );
						var $sliders = $items.find( '.w-slider' );
						this.afterAppendItems( $items );

						if ( isotope ) {
							isotope.insert( $items );
							isotope.reloadItems();
						}

						if ( $sliders.length ) {
							$us.getScript( $us.templateDirectoryUri + '/common/js/vendor/royalslider.js', function() {
								$sliders.each( function( index, slider ) {
									$( slider ).wSlider().find( '.royalSlider' ).data( 'royalSlider' ).ev.on( 'rsAfterInit', function() {
										if ( isotope ) {
											this.$list.isotope( 'layout' );
										}
									} );
								}.bind( this ) );

							}.bind( this ) );
						}

						if ( isotope ) {
							if ( this.$list.find( '.size_1x1' ).length ) {
								smallestItemSelector = '.size_1x1';
							} else if ( this.$list.find( '.size_1x2' ).length ) {
								smallestItemSelector = '.size_1x2';
							} else if ( this.$list.find( '.size_2x1' ).length ) {
								smallestItemSelector = '.size_2x1';
							} else if ( this.$list.find( '.size_2x2' ).length ) {
								smallestItemSelector = '.size_2x2';
							}
							if ( isotope.options.masonry ) {
								isotope.options.masonry.columnWidth = smallestItemSelector || '.w-grid-item';
							}
							this.$list.isotope( 'layout' );
							this.$list.trigger( 'layoutComplete' );
						}

						if ( this.paginationType == 'ajax' ) {
							//Check any tabs in loaded content
							if ( $items.find( '.w-tabs' ).length > 0 ) {
								//if post has tabs - init them
								$( '.w-tabs', $items ).each( function() {
									$( this ).wTabs();
								} );
							}
							//Check any videos in loaded content
							if ( $items.find( '.w-video' ).length > 0 ) {
								//if post has videos - init them
								$( '.w-video', $items ).each( function() {
									$( this ).wVideo();
								} );
							}

							if ( page == 1 ) {
								var $jsonContainer = $result.find( '.w-grid-json' );
								if ( $jsonContainer.length ) {
									var ajaxData = $jsonContainer[ 0 ].onclick() || {};
									this.ajaxData.max_num_pages = ajaxData.max_num_pages || this.ajaxData.max_num_pages;
								} else {
									this.ajaxData.max_num_pages = 1;
								}
							}

							if ( this.templateVars.query_args.paged >= this.ajaxData.max_num_pages || ! $items.length ) {
								this.$loadmore.addClass( 'done' );
							} else {
								this.$loadmore.removeClass( 'done' );
								this.$loadmore.removeClass( 'loading' );
							}

							if ( this.infiniteScroll ) {
								$us.waypoints.add( this.$loadmore, '-70%', function() {
									if ( ! this.loading ) {
										// check none
										this.$loadmore.click();
									}
								}.bind( this ) );

								// If the scroll value has changed, then scroll to the starting position,
								// as in some browsers this is not true. After loading the data, the scroll is not
								// calculated correctly.
							} else if ( Math.round( this.prevScrollTop ) != Math.round( $us.$window.scrollTop() ) ) {
								$us.$window.scrollTop( this.prevScrollTop );
							}

						} else if ( this.paginationType === 'regular' && this.changeUpdateState ) {
							// Pagination Link Correction
							$( 'a[href]', $pagination ).each( function( _, item ) {
								var $item = $( item ),
									pathname = location.pathname.replace( /((\/page.*)?)\/$/, '' );
								$item.attr( 'href', pathname + $item.attr( 'href' ) );
							} );
							this.$pagination.html( $pagination );
						}

						if ( this.$container.hasClass( 'popup_page' ) ) {
							$.each( $items, function( index, item ) {
								var $loadedItem = $( item ),
									$anchor = $loadedItem.find( '.w-grid-item-anchor' ),
									itemUrl = $anchor.attr( 'href' );

								if ( ! $loadedItem.hasClass( 'custom-link' ) ) {
									$anchor.click( function( e ) {
										if ( $us.$window.width() >= $us.canvasOptions.disableEffectsWidth ) {
											e.stopPropagation();
											e.preventDefault();
											this.openLightboxItem( itemUrl, $loadedItem );
										}
									}.bind( this ) );
								}
							}.bind( this ) );
						}

						// The display a message in the absence of data.
						var $result_none = $result.find( '> .w-grid-none' );
						if ( this.changeUpdateState && $result_none.length ) {
							var $none = this.$container.next( '.w-grid-none' );
							if ( $none.length ) {
								$none.removeClass( 'hidden' );
							} else {
								this.$container
									.after( $result_none );
							}
							// If the result contains a grid that can be Reusable Block, then we will initialize
							var $nextGrid = this.$container.next( '.w-grid-none' ).find( '.w-grid:first' );
							if ( $nextGrid.length ) {
								$nextGrid.wGrid();
							}
							this.none = true;
						}

						// Send the result to the filter grid.
						if ( this.changeUpdateState && this.gridFilter ) {
							var $jsonData = $result.filter( '.w-grid-filter-json-data:first' );
							if ( $jsonData.length ) {
								this.gridFilter
									.trigger( 'us_grid_filter.update-items-amount', $jsonData[ 0 ].onclick() || {} );
							}
							$jsonData.remove();
						}

						// Add custom styles to Grid.
						var customStyles = $( 'style#grid-post-content-css', $result ).html() || '';
						if ( customStyles ) {
							if ( ! this.$style.length ) {
								this.$style = $( '<style></style>' );
								this.$container.append( this.$style );
							}
							this.$style.text( this.$style.text() + customStyles );
						}

						// Resize canvas to avoid Parallax calculation issues.
						$us.$canvas.resize();
						this.$preloader.removeClass( 'active' );

						// Init load animation
						if ( window.USAnimate && this.$container.is( '.with_css_animation' ) ) {
							new USAnimate( this.$container );
						}

					}.bind( this ) );

					// Scroll to top of grid
					this._scrollToGrid();

					this.loading = false;

					// Trigger custom event on success, might be used by 3rd party devs
					this.$container.trigger( 'USGridItemsLoaded' );

				}.bind( this ),
				error: function() {
					this.$loadmore.removeClass( 'loading' );
				}.bind( this )
			} );

			this.curPage = page;
			this.curFilterTaxonomy = taxonomy;
		},
		// Scroll to top of grid
		_scrollToGrid: function() {
			// Check, if it's not load more and orderby
			if ( this.curPage === 1 ) {
				var gridPos = this.$container.find( '.w-grid-list' ).offset().top;
				if ( gridPos !== undefined && $us.$window.scrollTop() > gridPos ) {
					$us.$htmlBody.animate( { scrollTop: ( gridPos - $us.header.getCurrentHeight() ) }, 500 /* scroll duration in milliseconds */ );
				}
			}
		},
		// Lightbox Functions.
		_hasScrollbar: function() {
			return document.documentElement.scrollHeight > document.documentElement.clientHeight;
		},
		_getScrollbarSize: function() {
			if ( $us.scrollbarSize === _undefined ) {
				var scrollDiv = document.createElement( 'div' );
				scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
				document.body.appendChild( scrollDiv );
				$us.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
				document.body.removeChild( scrollDiv );
			}
			return $us.scrollbarSize;
		},
		openLightboxItem: function( itemUrl, $item ) {
			this.showLightbox();

			var prevIndex,
				nextIndex,
				currentIndex = 0,
				items = this.$items.filter( ':visible:not(.custom-link)' ).toArray();
			for ( var i in items ) {
				if ( $item.is( items[ i ] ) ) {
					currentIndex = parseInt( i );
					break;
				}
			}
			// Get prev/next index
			if ( currentIndex > 0 ) {
				prevIndex = currentIndex - 1;
			}
			if ( currentIndex < items.length ) {
				nextIndex = currentIndex + 1;
			}

			var $prevItem = $( $.isNumeric( prevIndex ) ? items[ prevIndex ] : '' ),
				$nextItem = $( $.isNumeric( nextIndex ) ? items[ nextIndex ] : '' );

			if ( $nextItem.length > 0 ) {
				this.$lightboxNextArrow.show();
				this.$lightboxNextArrow.attr( 'title', $nextItem.find( '.w-grid-item-title' ).text() );
				this.$lightboxNextArrow.off( 'click' ).click( function( e ) {
					var $nextItemAnchor = $nextItem.find( '.w-grid-item-anchor' ),
						nextItemUrl = $nextItemAnchor.attr( 'href' );
					e.stopPropagation();
					e.preventDefault();

					this.openLightboxItem( nextItemUrl, $nextItem );
				}.bind( this ) );
			} else {
				this.$lightboxNextArrow.attr( 'title', '' );
				this.$lightboxNextArrow.hide();
			}

			if ( $prevItem.length > 0 ) {
				this.$lightboxPrevArrow.show();
				this.$lightboxPrevArrow.attr( 'title', $prevItem.find( '.w-grid-item-title' ).text() );
				this.$lightboxPrevArrow.off( 'click' ).on( 'click', function( e ) {
					var $prevItemAnchor = $prevItem.find( '.w-grid-item-anchor' ),
						prevItemUrl = $prevItemAnchor.attr( 'href' );
					e.stopPropagation();
					e.preventDefault();

					this.openLightboxItem( prevItemUrl, $prevItem );
				}.bind( this ) );
			} else {
				this.$lightboxPrevArrow.attr( 'title', '' );
				this.$lightboxPrevArrow.hide();
			}

			if ( itemUrl.indexOf( '?' ) !== - 1 ) {
				this.$lightboxContentFrame.attr( 'src', itemUrl + '&us_iframe=1' );
			} else {
				this.$lightboxContentFrame.attr( 'src', itemUrl + '?us_iframe=1' );
			}

			// Replace window location with item's URL
			if ( history.replaceState ) {
				history.replaceState( null, null, itemUrl );
			}
			this.$lightboxContentFrame.off( 'load' ).on( 'load', function() {
				this.lightboxContentLoaded();
			}.bind( this ) );

		},
		lightboxContentLoaded: function() {
			this.$lightboxContentPreloader.css( 'display', 'none' );
			this.$lightboxContentFrame
				.contents()
				.find( 'body' )
				.off( 'keyup.usCloseLightbox' )
				.on( 'keyup.usCloseLightbox', function( e ) {
					if ( e.key === "Escape" ) {
						this.hideLightbox();
					}
				}.bind( this ) );
		},
		showLightbox: function() {
			clearTimeout( this.lightboxTimer );
			this.$lightboxOverlay.appendTo( $us.$body ).show();
			this.$lightboxWrap.appendTo( $us.$body ).show();
			this.lightboxOpened = true;

			this.$lightboxContentPreloader.css( 'display', 'block' );
			$us.$html.addClass( 'usoverlay_fixed' );

			if ( ! $.isMobile ) {
				// Storing the value for the whole popup visibility session
				this.windowHasScrollbar = this._hasScrollbar();
				if ( this.windowHasScrollbar && this._getScrollbarSize() ) {
					$us.$html.css( 'margin-right', this._getScrollbarSize() );
				}
			}
			this.lightboxTimer = setTimeout( function() {
				this.afterShowLightbox();
			}.bind( this ), 25 );
		},
		afterShowLightbox: function() {
			clearTimeout( this.lightboxTimer );

			this.$container.on( 'keyup', function( e ) {
				if ( this.$container.hasClass( 'popup_page' ) ) {
					if ( e.key === "Escape" ) {
						this.hideLightbox();
					}
				}
			}.bind( this ) );

			this.$lightboxOverlay.addClass( 'active' );
			this.$lightboxBox.addClass( 'active' );

			$us.$canvas.trigger( 'contentChange' );
			$us.$window.trigger( 'resize' );
		},
		hideLightbox: function() {
			clearTimeout( this.lightboxTimer );
			this.lightboxOpened = false;
			this.$lightboxOverlay.removeClass( 'active' );
			this.$lightboxBox.removeClass( 'active' );
			// Replace window location back to original URL
			if ( history.replaceState ) {
				history.replaceState( null, null, this.originalURL );
			}

			this.lightboxTimer = setTimeout( function() {
				this.afterHideLightbox();
			}.bind( this ), 500 );
		},
		afterHideLightbox: function() {
			this.$container.off( 'keyup' );
			clearTimeout( this.lightboxTimer );
			this.$lightboxOverlay.appendTo( this.$container ).hide();
			this.$lightboxWrap.appendTo( this.$container ).hide();
			this.$lightboxContentFrame.attr( 'src', 'about:blank' );
			$us.$html.removeClass( 'usoverlay_fixed' );
			if ( ! $.isMobile ) {
				if ( this.windowHasScrollbar ) {
					$us.$html.css( 'margin-right', '' );
				}
			}
		},
		/**
		 * Overloadable function for themes.
		 *
		 * @param $items
		 */
		beforeAppendItems: function( $items ) {
			// Init `Show More` for grid items loaded by AJAX
			if ( $( '[data-content-height]', $items ).length ) {
				var handle = $us.timeout( function() {
					$( '[data-content-height]', $items ).usCollapsibleContent();
					$us.clearTimeout( handle );
				}, 1 );
			}
		},

		afterAppendItems: function( $items ) {
		}

	};

	$.fn.wGrid = function( options ) {
		return this.each( function() {
			$( this ).data( 'wGrid', new $us.WGrid( this, options ) );
		} );
	};

	$( function() {
		$( '.w-grid' ).wGrid();
	} );

	$( '.w-grid-list' ).each( function() {
		var $list = $( this );
		if ( ! $list.find( '[ref=magnificPopupGrid]' ).length ) {
			return;
		}
		$us.getScript( $us.templateDirectoryUri + '/common/js/vendor/magnific-popup.js', function() {
			var delegateStr = 'a[ref=magnificPopupGrid]:visible',
				popupOptions;
			if ( $list.hasClass( 'owl-carousel' ) ) {
				delegateStr = '.owl-item:not(.cloned) a[ref=magnificPopupGrid]';
			}
			popupOptions = {
				type: 'image',
				delegate: delegateStr,
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0, 1],
					tPrev: $us.langOptions.magnificPopup.tPrev, // Alt text on left arrow
					tNext: $us.langOptions.magnificPopup.tNext, // Alt text on right arrow
					tCounter: $us.langOptions.magnificPopup.tCounter // Markup for "1 of 7" counter
				},
				removalDelay: 300,
				mainClass: 'mfp-fade',
				fixedContentPos: true,
				callbacks: {
					beforeOpen: function() {
						var owlCarousel = $list.data( 'owl.carousel' );
						if ( owlCarousel && owlCarousel.settings.autoplay ) {
							$list.trigger( 'stop.owl.autoplay' );
						}
					},
					beforeClose: function() {
						var owlCarousel = $list.data( 'owl.carousel' );
						if ( owlCarousel && owlCarousel.settings.autoplay ) {
							$list.trigger( 'play.owl.autoplay' );
						}
					}
				}
			};
			$list.magnificPopup( popupOptions );
			if ( $list.hasClass( 'owl-carousel' ) ) {
				$list.on( 'initialized.owl.carousel', function( initEvent ) {
					var $currentList = $( initEvent.currentTarget ),
						items = {};
					$( '.owl-item:not(.cloned)', $currentList ).each( function( _, item ) {
						var $item = $( item ),
							id = $item.find( '[data-id]' ).data( 'id' );
						if ( ! items.hasOwnProperty( id ) ) {
							items[ id ] = $item;
						}
					} );
					$currentList.on( 'click', '.owl-item.cloned', function( e ) {
						e.preventDefault();
						e.stopPropagation();
						var $target = $( e.currentTarget ),
							id = $target.find( '[data-id]' ).data( 'id' );
						if ( items.hasOwnProperty( id ) ) {
							$( 'a[ref=magnificPopupGrid]', items[ id ] )
								.trigger( 'click' );
						}
					} );
				} );
			}
		} );

	} );
} )( jQuery );
