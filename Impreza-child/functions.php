<?php
function enqueue_custom_scripts()
{

    wp_enqueue_script('custom-quantity', get_stylesheet_directory_uri() . '/js/quantity.js', array('jquery'), null, true);
}

add_action('wp_enqueue_scripts', 'enqueue_custom_scripts');

function custom_modify_add_to_cart_link($link, $product, $args)
{

    $quantity_field = woocommerce_quantity_input(array(
        'min_value' => apply_filters('woocommerce_quantity_input_min', 1, $product),
        'max_value' => apply_filters('woocommerce_quantity_input_max', $product->backorders_allowed() ? '' : $product->get_stock_quantity(), $product),
        'input_value' => isset($args['quantity']) ? $args['quantity'] : 1,
    ), $product, false);


    return '<div class="add-cart-control">' . $quantity_field . '<button type="button" class="' . esc_attr(isset($args['class']) ? $args['class'] : 'button') . '" ' . (isset($args['attributes']) ? wc_implode_html_attributes($args['attributes']) : '') . ' data-quantity="' . esc_attr(isset($args['quantity']) ? $args['quantity'] : 1) . '" data-product_id="' . esc_attr($product->get_id()) . '">' . esc_html($product->add_to_cart_text()) . '</button></div>';
}


add_filter('woocommerce_loop_add_to_cart_link', 'custom_modify_add_to_cart_link', 10, 3);

remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);

// ============убирает strong================
add_action('template_redirect', 'set_replace_content', 10, 2);

function set_replace_content()
{
    if (is_product()) {
        ob_start(function (
            $buffer
        ) {
            $buffer = str_ireplace(['<strong>', '</strong>', '<b>', '</b>'], '', $buffer);
            return $buffer;
        });
    }
}
