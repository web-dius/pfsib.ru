<?php defined('ABSPATH') or die('This script cannot be accessed directly.');

/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * Required for "Page Template" option
 */

get_header('shop');



?>
<main id="page-content" class="l-main" <?php echo (us_get_option('schema_markup')) ? ' itemprop="mainContentOfPage"' : ''; ?>>

	<?php
	if (us_get_option('enable_sidebar_titlebar', 0)) {

		// Titlebar, if it is enabled in Theme Options
		us_load_template('templates/titlebar');

		// START wrapper for Sidebar
		us_load_template('templates/sidebar', array('place' => 'before'));
	}

	us_load_template('templates/content');



	if (us_get_option('enable_sidebar_titlebar', 0)) {
		// AFTER wrapper for Sidebar
		us_load_template('templates/sidebar', array('place' => 'after'));
	}

	?>
</main>


<?php
// ---------------Дима---------------
/*
if ($_GET["dev_dius"] == "filter") :

	global $wp_query;

	$tmpArgs = [
		'product_cat' => $wp_query->query["product_cat"],
		'orderby' => $wp_query->query_vars["orderby"],
		'order' => $wp_query->query_vars["order"],
		"posts_per_page" => 999,
	];

	$query = new WP_Query($tmpArgs);
	$posts = $query->posts;
	$listAttrs = [];
	$newListAttrs = [];

	foreach ($posts as $arPost) {
		$fields = get_post_custom($arPost->ID);
		if (!empty($fields)) {
			foreach ($fields as $keyField => $valField) {
				if (stristr($keyField, 'ds-')) {
					$listAttrs[$keyField][] = $valField[0];
				}
			}
		}
	}

	if (!empty($listAttrs)) {
		foreach ($listAttrs as $key => $attr) {
			$newListAttrs[$key] = array_unique($attr);
			sort($newListAttrs[$key]);
		}
	}

	// Из этого массива можно сформировать тело фильтра с полями и параметрами.

	// echo '<pre>';
	// print_r($newListAttrs);
	// echo '</pre>';
*/
?>
<!-- <div id="32">
	<h2>Фильтр</h2>
	<form action="">
		<?php foreach ($newListAttrs as $keyArr => $el) : ?>

			<h3><? echo $keyArr; ?></h3>
			<div class="block">
				<?php foreach ($el as $key => $attr) : ?>

					<label><?php echo $attr ?></label>
					<input type="checkbox" name="<? echo $keyArr; ?>" value="<? echo $attr; ?>">

				<?php endforeach; ?>

			<?php endforeach; ?>
			<button type="submit">Отправить</button>
	</form>
</div> -->


<!-- ----------Фильтр------------------- -->
<?php
function getFilter()
{
	// -----------------
	if ($_GET["dev_dius"] == "filter") {

		global $wp_query;

		$tmpArgs = [
			'product_cat' => $wp_query->query["product_cat"],
			'orderby' => $wp_query->query_vars["orderby"],
			'order' => $wp_query->query_vars["order"],
			"posts_per_page" => 999,
		];

		$query = new WP_Query($tmpArgs);
		$posts = $query->posts;
		$listAttrs = [];
		$newListAttrs = [];

		foreach ($posts as $arPost) {
			$fields = get_post_custom($arPost->ID);
			if (!empty($fields)) {
				foreach ($fields as $keyField => $valField) {
					if (stristr($keyField, 'ds-')) {
						$listAttrs[$keyField][] = $valField[0];
					}
				}
			}
		}

		if (!empty($listAttrs)) {
			foreach ($listAttrs as $key => $attr) {
				$newListAttrs[$key] = array_unique($attr);
				sort($newListAttrs[$key]);
			}
		}

		// ------------------

		$output = '';
		$output .= '<h2>Фильтр</h2>';
		$output .= '<form action="">';
		foreach ($newListAttrs as $keyArr => $el) {
			$output .= '<h3>' .  $keyArr . '</h3>';
			$output .= '<div class="block">';
			foreach ($el as $key => $attr) {
				$output .= '<label>' . $attr . '</label>';
				$output .= '<input type="checkbox" name="' . $keyArr . '" value="' . $attr . '">';
			}
			$output .= '</div>';
		}
		$output .= '<button type="submit">Отправить</button>';



		$output .= '</form>';
	}
	return $output;
}
?>



<?php
get_footer('shop');
