<?php

/**
 * Theme functions and definitions
 */

defined('ABSPATH') or die('This script cannot be accessed directly.');
update_option('us_license_activated', 1);
update_option('us_license_secret', 'us_license_secret');

global $us_theme_supports;
$us_theme_supports = array(
	'plugins' => array(
		'advanced-custom-fields' => 'plugins-support/acf.php',
		'bbpress' => 'plugins-support/bbpress.php',
		'filebird' => 'plugins-support/filebird.php',
		'gravityforms' => 'plugins-support/gravityforms.php',
		'js_composer' => 'plugins-support/js_composer/js_composer.php',
		'post_views_counter' => 'plugins-support/post_views_counter.php',
		'revslider' => 'plugins-support/revslider.php',
		'tablepress' => 'plugins-support/tablepress.php',
		'the-events-calendar' => 'plugins-support/the_events_calendar.php',
		'tiny_mce' => 'plugins-support/tiny_mce.php',
		'Ultimate_VC_Addons' => 'plugins-support/Ultimate_VC_Addons.php',
		'woocommerce' => 'plugins-support/woocommerce.php',
		'woocommerce-germanized' => 'plugins-support/woocommerce-germanized.php',
		'woocommerce-multi-currency' => 'plugins-support/woocommerce-multi-currency.php',
		'wp_rocket' => 'plugins-support/wp_rocket.php',
		'yoast' => 'plugins-support/yoast.php',
	),
	// Include plugins that relate to translations and can be used in helpers.php
	'translate_plugins' => array(
		'wpml' => 'plugins-support/wpml.php',
		'polylang' => 'plugins-support/polylang.php',
	),
);

require dirname(__FILE__) . '/common/framework.php';

## Вариант 1: 'canonical' на первую в SEO by Yoast
function wpcrft_return_canonical()
{
	// is_paged() относится только к страницам типа архивы	, главной, дат, к тем которые делятся на несколько
	if (is_paged()) {
		$canon_page = get_pagenum_link(1);
		return $canon_page;
	}
}

add_filter('wpseo_canonical', 'wpcrft_return_canonical', 100);
add_filter('woocommerce_cart_needs_payment', '__return_false');

// --------------------------Фильтр---------------------
// Добавляет шорткод
add_shortcode('filter', 'getFilter');

// Enable shortcode execution in text widget
add_filter('widget_text', 'do_shortcode');
