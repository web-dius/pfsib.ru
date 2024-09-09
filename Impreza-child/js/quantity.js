document.addEventListener('DOMContentLoaded', function () {
    var quantityButtons = document.querySelectorAll('.button[data-quantity]');

    quantityButtons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            var input = this.parentNode.querySelector('input[type="number"]');
            var quantity = input.value;
            this.setAttribute('data-quantity', quantity);
            this.closest('form.cart').submit();
        });
    });

});





jQuery(function ($) {
    $('body').on('added_to_cart', function (event, fragments, cart_hash, $button) {
        var productImage;
        var productName;

        if ($button.hasClass('button-smpl')) {
            productImage = $button.closest('.product-container').find('.wp-post-image');
            productName = $button.closest('.product-container').find('.post_title').text();

            $('.w-cart-notification .product-name').text(productName);
            $('.w-cart-notification').fadeIn().delay(3000).fadeOut();

        } else {
            productImage = $button.closest('.product-list-item').find('.post_image img');
            productName = $button.closest('.product-list-item').find('.post_title a').text();
            $('.w-cart-notification .product-name').text(productName);
            $('.w-cart-notification').fadeIn().delay(3000).fadeOut();
        }

        var imageClone = productImage.clone();
        var cartIcon = $('.w-cart');
        var offset = productImage.offset();
        $button.attr('disabled', 'disabled');
        $button.text('В корзине');

        imageClone
            .addClass('animated-thumbnail')
            .css({
                'width': productImage.width(),
                'height': productImage.height(),
                'position': 'absolute',
                'top': offset.top,
                'left': offset.left
            })
            .appendTo('body')
            .animate({
                'top': cartIcon.offset().top + 10,
                'left': cartIcon.offset().left + 10,
                'width': 20,
                'height': 20
            }, 1000, 'easeInOutExpo', function () {
                $(this).remove();
            });
    });



    // 	$('head')
    // 		.append(`<link rel='stylesheet' id='new-year-style-css' href='https://pfsib.ru/wp-content/themes/Impreza/css/ds-lights-muzik.css' />`)
    // 		.append(`<script src="https://pfsib.ru/wp-content/themes/Impreza/js/ds-lights-muzik1.js" id="new-year-core-js"></script>`)
    // 	;

    // 	$('body').prepend(`<div class="b-page_newyear" style="position:relative; height:100px;">  
    // <div class="b-page__content">  
    // <i class="b-head-decor">  
    // <i class="b-head-decor__inner b-head-decor__inner_n1">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // <i class="b-head-decor__inner b-head-decor__inner_n2">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // <i class="b-head-decor__inner b-head-decor__inner_n3">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // <i class="b-head-decor__inner b-head-decor__inner_n4">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // <i class="b-head-decor__inner b-head-decor__inner_n5">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // <i class="b-head-decor__inner b-head-decor__inner_n6">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // <i class="b-head-decor__inner b-head-decor__inner_n7">  
    // <div class="b-ball b-ball_n1 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n2 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n3 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n4 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n5 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n6 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n7 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n8 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_n9 b-ball_bounce">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i1">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i2">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i3">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i4">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i5">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // <div class="b-ball b-ball_i6">  
    // <div class="b-ball__right"></div><div class="b-ball__i"></div></div>  
    // </i>  
    // </i>  
    // </div>  
    // </div>`);
});

// =================custom price==================
window.onload = function () {

    let items1 = document.querySelectorAll(".product-list-item");
    let btnMore = document.querySelector(".w-btn.us-btn-style_1");

    btnMore.addEventListener("click", function () {
        setTimeout(function () {
            let items2 = document.querySelectorAll(".product-list-item");
            setPrice(items2);
        }, 500)


    })

    function setPrice(items) {
        items.forEach(el => {
            let price = el.querySelector(".price>.woocommerce-Price-amount>bdi");
            let valuePrice = price.innerHTML.split("&")[0];
            if (valuePrice == "0,00") {
                price.innerHTML = "По запросу";
                let item = el;
                let itemQuantity = item.querySelector(".w-btn-wrapper>.add-cart-control>.quantity");
                let itemBtnOld = item.querySelector(".button");
                let itemBtBlock = item.querySelector(".add-cart-control");


                itemQuantity.style.cssText = `display: none`;
                itemBtnOld.style.cssText = `display: none`;
                itemBtBlock.insertAdjacentHTML("beforeend", `
                    <button class=" btn-zayavka_pricelist button button-form-popup wp-element-button product_type_simple add_to_cart_button ajax_add_to_cart" style="width: 153px" onclick="try{return false}catch(e){console.error(e)}">
                        Запросить цену
                    </button>
                    `);

                let itemBtNew = item.querySelector(".button-form-popup");
                itemBtNew.style.cssText = `
                background: var(--color-content-link);
                `

                itemBtNew.addEventListener("mouseover", function () {
                    itemBtNew.style.cssText = `
                    background: var(--color-content-secondary);
                `
                });

                itemBtNew.addEventListener("mouseout", function () {
                    itemBtNew.style.cssText = `
                    background: var(--color-content-link);
                `
                })
            }
        })
    };
    setPrice(items1);

}





