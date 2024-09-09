jQuery(function ($) {

    $(document).ajaxSuccess(function () {

        if ($('body').find('.btn-zayavka_pricelist').length > 0) {

            $popupOpenBtn = $('body').find('.btn-zayavka_pricelist');



            if ($('body').find('.product-list-item').length > 0) {

                $popupOpenBtn.each((index, item) => {

                    $itemName = $(item).parents('.product-list-item').find('h4').text();

                    $(item).attr('data-item', $itemName);

                });

            }



            $popupOpenBtn.click(function () {

                var form = $('body').find('#wpcf7-f5816-o2');

                var itemName = $(this).data("item");

                form.find('.item-name').attr('value', itemName);

                form.find('.item-name').attr('readonly', 'true');

            });

        }

    });


    /* 
    if($( window ).width() >= 900) {
        if($('body').find('.w-nav-list.level_2').length > 0) {
            $('.w-nav-list.level_1.hover_simple ').hover(function(){
                $menuLvl2 = $('body').find('.w-nav-list.level_2');
                $menuLvl2.find('.w-nav-list.level_3').each(function(){
                    console.log('this => ', $(this).offset().top);
                    console.log('menu => ', $menuLvl2.offset().top);
                    $top = $(this).offset().top - $menuLvl2.offset().top;
                    $(this).css({'top':'-'+$top+'px','min-height':$menuLvl2.height()})
                    $(this).find('.w-nav-list.level_4').css({'min-height':$menuLvl2.height()});
                    $(this).find('.w-nav-list.level_5').css({'min-height':$menuLvl2.height()});
                    $(this).find('.w-nav-list.level_6').css({'min-height':$menuLvl2.height()});
                });
            });
        }
    } */

    if ($(window).width() >= 900) {
        if ($('body').find('.w-nav-list.level_2').length > 0) {
            $menuLvl2 = $('body').find('.w-nav-list.level_2');
            $('.w-nav-list.level_1.hover_simple .w-nav-list.level_2 .menu-item').hover(function () {
                $this = $(this);

                if ($this.find('.w-nav-list.level_3').length > 0) {
                    $lvl = $this.find('.w-nav-list.level_3');
                    $top = $lvl.offset().top - $menuLvl2.offset().top;
                    $lvl.css({ 'top': '-' + $top + 'px', 'min-height': $menuLvl2.height() });
                }
            });

            $('.w-nav-list.level_1.hover_simple .w-nav-list.level_3 .menu-item').hover(function () {
                $this = $(this);

                if ($this.find('.w-nav-list.level_4').length > 0) {
                    $lvl = $this.find('.w-nav-list.level_4');
                    $top = $lvl.offset().top - $menuLvl2.offset().top;
                    $lvl.css({ 'top': '-' + $top + 'px', 'min-height': $menuLvl2.height() });
                }
            });
        }
    }

    // ===========================

    // let wrap = $(".wpb_wrapper");

    // wrap.children().each(function () {
    //     $(this).children("p").each(function () {
    //         let p = $(this);
    //         p.children().each(function () {
    //             if ($(this).prop('tagName') == "STRONG") {

    //                 $(this).replaceWith(function (index, oldHTML) {
    //                     return $("<span>").html(oldHTML);
    //                 });
    //             }
    //         })
    //     })
    // })
});


