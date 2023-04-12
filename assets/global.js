$.cookie = function(key, value, options) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
        options = $.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days)
        }
        value = String(value);
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''))
    }
    options = value || {};
    var decode = options.raw ? function(s) {
        return s
    } : decodeURIComponent;
    var pairs = document.cookie.split('; ');
    for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
        if (decode(pair[0]) === key) return decode(pair[1] || '')
    }
    return null
}

if ((typeof Shopify) === 'undefined') {
    Shopify = {};
}
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);
        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');
            if (isNaN(number) || number == null) {
                return 0;
            }
            number = (number / 100.0).toFixed(precision);
            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';
            return dollars + cents;
        }
        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}
Shopify.optionsMap = {};
Shopify.updateOptionsInSelector = function(selectorIndex) {
    switch (selectorIndex) {
        case 0:
            var key = 'root';
            var selector = jQuery('.single-option-selector:eq(0)');
            break;
        case 1:
            var key = jQuery('.single-option-selector:eq(0)').val();
            var selector = jQuery('.single-option-selector:eq(1)');
            break;
        case 2:
            var key = jQuery('.single-option-selector:eq(0)').val();
            key += ' / ' + jQuery('.single-option-selector:eq(1)').val();
            var selector = jQuery('.single-option-selector:eq(2)');
    }
    var initialValue = selector.val();
    selector.empty();
    var availableOptions = Shopify.optionsMap[key];
    for (var i = 0; i < availableOptions.length; i++) {
        var option = availableOptions[i];
        var newOption = jQuery('<option></option>').val(option).html(option);
        selector.append(newOption);
    }
    if (jQuery.inArray(initialValue, availableOptions) !== -1) {
        selector.val(initialValue);
    }
    selector.trigger('change');
};
Shopify.linkOptionSelectors = function(product) {
    for (var i = 0; i < product.variants.length; i++) {
        var variant = product.variants[i];
        if (variant.available) {
            Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
            Shopify.optionsMap['root'].push(variant.option1);
            Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
            if (product.options.length > 1) {
                var key = variant.option1;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option2);
                Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            }
            if (product.options.length === 3) {
                var key = variant.option1 + ' / ' + variant.option2;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option3);
                Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            }
        }
    }
    Shopify.updateOptionsInSelector(0);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    jQuery(".single-option-selector:eq(0)").change(function() {
        Shopify.updateOptionsInSelector(1);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true;
    });
    jQuery(".single-option-selector:eq(1)").change(function() {
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true;
    });
};
window.novtheme = window.novtheme || {};
var isLoggedIn;
isLoggedIn = false;
var current_width = $(window).width(),
    min_width = 768,
    responsive_mobile = current_width < min_width,
    flag_sticky = false;

var wishListsArr = localStorage.getItem('wishListsArr') ? JSON.parse(localStorage.getItem('wishListsArr')) : [];
localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
if (wishListsArr.length) {
    wishListsArr = JSON.parse(localStorage.getItem('wishListsArr'));
};
novtheme.init = function() {
    novtheme.cacheSelectors();
    novtheme.hoverBlockCart();
    novtheme.popupCart();
    novtheme.ThumbnailProduct();
    novtheme.RelatedBlog();
    novtheme.load_canvas_menu();
    novtheme.NovTogglePage();
    novtheme.Countdown();
    novtheme.click_button_canvas_menu();
    novtheme.productImageSwitch();
    novtheme.goToTop();
    novtheme.goToTopMobile();
    novtheme.NovHeightBoxContent();
    novtheme.MenuSidebar();
    novtheme.NovToggleAction();
    novtheme.NovToggleSearch();
    novtheme.NovEventClickSearchMobile();
    novtheme.Product__Thumnail();
    novtheme.NovMediumToggle();
    novtheme.HideShowPassword();
    novtheme.NovSearchToggle();
    novtheme.tooltip();
    novtheme.initNovWishListIcons();
    novtheme.doAddOrRemoveWishlistProduct();
    novtheme.doAddOrRemoveWishlist();
    novtheme.CollectionPage();
    novtheme.NovAccordion();
    novtheme.variantName();
    novtheme.ParallaxImage();
    novtheme.SlideShowSplit();
    if (current_width >= 992) {
        novtheme.StickyHeader(true);
        flag_sticky = true;
    }
    if ($('.template-cart').length > 0 ) {
        novtheme.NovStickIn();
    }
};

//Tooltip, activated by hover event
novtheme.tooltip = function() {
    $("body").tooltip({   
        selector: "[data-toggle='tooltip']",
        container: "body"
    });
};
novtheme.swapChildren = function(obj1, obj2) {
    var temp = obj2.children().detach();
    obj2.empty().append(obj1.children().detach());
    obj1.append(temp);
};
novtheme.toggleMobileStyles = function() {
    if (responsive_mobile) {
        $("*[id^='_desktop_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_desktop_', '_mobile_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[id^='_mobile_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_mobile_', '_desktop_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
};
novtheme.toggleSticky = function(action) {
    if (action == true) {
        $("*[class^='contentsticky_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentsticky_', 'contentstickynew_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[class^='contentstickynew_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentstickynew_', 'contentsticky_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
}

novtheme.StickyHeader = function(flag_sticky) {
    if ($('.site-header').hasClass('sticky-menu')) {
        if (flag_sticky == true) {
            var time;
            var height = $('.site-header').height();
            var flag = true;
            $(window).scroll(function() {
                if (time) clearTimeout(time);
                time = setTimeout(function() {
                    if ($(window).scrollTop() > height) {
                        if (flag == true) {
                            $('#header-sticky').addClass('sticky-menu-active');
                            $('.site-header').css('height', height);
                            novtheme.toggleSticky(true);
                            flag = false;
                        }
                    } else {
                        if (flag == false) {
                            $('#header-sticky').removeClass('sticky-menu-active');
                            novtheme.toggleSticky(false);
                            $('.site-header').css('height', 'auto');
                            flag = true;
                        }
                    }
                }, 100);
            });
        }
    }
}
var flag_sticky = false;
$(window).on('resize', function() {
    var _cw = current_width;
    var _mw = min_width;
    var _w = $(window).width();
    var _toggle = (_cw >= _mw && _w < _mw) || (_cw < _mw && _w >= _mw);
    responsive_mobile = _cw >= _mw;
    current_width = _w;
    if (_toggle) {
        novtheme.toggleMobileStyles();
        novtheme.load_canvas_menu();
        novtheme.NovTogglePage();
        novtheme.NovHeightBoxContent();
        novtheme.popupCart();
    }
    if (current_width <= 768) {
        if (flag_sticky == true) {
            novtheme.toggleSticky(false);
            $('#header-sticky').removeClass('sticky-menu-active');
        }
    } else {}
});
novtheme.initNovWishListIcons = function() {
    if (!wishListsArr.length) {
        return;
    }

    for (var i = 0; i < wishListsArr.length; i++) {
        var icon = $('[data-product-handle="'+ wishListsArr[i] +'"]');
        icon.addClass('whislist-added');
        icon.find('.wishlist-text').text('Remove Wishlist');
    };

    if (typeof(Storage) !== 'undefined') {
        if (wishListsArr.length <= 0) {
            return;
        }

        setTimeout(function() {
            wishListsArr.forEach(function(item) {
                novtheme.setNovAddedForWishlistIcon(item);
            });
        }, 1000);
    } else {
        alert('Storage no support!');
    }
};
novtheme.setNovAddedForWishlistIcon = function(ProductHandle) {
    var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]');
    var textadd = 'Add To Wishlist';
    var textremove = 'Remove Wishlist';
    idxArr = wishListsArr.indexOf(ProductHandle);

    if (idxArr >= 0) {
        wishlistElm.addClass('whislist-added');
        wishlistElm.find('.wishlist-text').text(textremove);
        wishlistElm.attr('title',textremove);
    }
    else {
        wishlistElm.removeClass('whislist-added');
        wishlistElm.find('.wishlist-text').text(textadd);
        wishlistElm.attr('title',textadd);
    };
};
novtheme.doAddOrRemoveWishlist = function() {
    var iconWishLists = '.item-product [data-icon-wishlist]';
    var textadd = 'Add To Wishlist';
    var textremove = 'Remove Wishlist';
        
    $(document).off('click.addOrRemoveWishlist', iconWishLists).on('click.addOrRemoveWishlist', iconWishLists, function(e) {
        e.preventDefault();

        var self = $(this),
        productId = self.data('id'),
        ProductHandle = self.data('product-handle'),
        idxArr = wishListsArr.indexOf(ProductHandle);

        if (!self.hasClass('whislist-added')) {
            self.addClass('whislist-added');
            self.find('.wishlist-text').text(textremove);
            self.attr({'title':textremove, 'data-original-title':textremove});
            $('.tooltip-inner').text(textremove);

            var title = self.parents('.item-product').find('.product__title').html();
            var image = self.parents('.item-product').find('.product__thumbnail').attr('src');

            $('.loading-modal').find('.product-title').html(title);
            $('.loading-modal').find('.product-image').attr('src', image);
            $('.loading-modal').find('.btn-wishlist').show();
            $('.loading-modal').css({"opacity": "1", "visibility": "initial", "transform": "translateX(0)", "transition": "all 0.3s"});
            $('.loading-modal').addClass('novload');
            setTimeout(function() {
                $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
                $('.loading-modal').removeClass('novload');
            }, 5000);

            if ($('[data-wishlist-container]').length) {
                novtheme.createNovWishListTplItem(ProductHandle);
            };

            wishListsArr.push(ProductHandle);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

        } else {
            self.removeClass('whislist-added');
            self.find('.wishlist-text').text(textadd);
            self.attr({'title':textadd, 'data-original-title':textadd});
            $('.tooltip-inner').text(textadd);
            if ($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
            }

            wishListsArr.splice(idxArr, 1);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
        };

        novtheme.setNovAddedForWishlistIcon(ProductHandle);
    });
};
novtheme.doAddOrRemoveWishlistProduct = function() {
    var iconWishLists = '.product-single a[data-icon-wishlist]';

    $(document).off('click.addOrRemoveWishlist', iconWishLists).on('click.addOrRemoveWishlist', iconWishLists, function(e) {
        e.preventDefault();

        var self = $(this),
        productId = self.data('id'),
        ProductHandle = self.data('product-handle'),
        idxArr = wishListsArr.indexOf(ProductHandle);

        if (!self.hasClass('whislist-added')) {
            self.addClass('whislist-added');
            self.find('.wishlist-text').text('Remove Wishlist');

            var title = self.parents('.product-single').find('.product-single__title').html();
            var image = self.parents('.product-single').find('.product-single__photos .thumblist .thumbItem img').attr('src');
            $('.loading-modal').find('.product-title').html(title);
            $('.loading-modal').find('.product-image').attr('src', image);
            $('.loading-modal').find('.btn-wishlist').show();
            $('.loading-modal').css({"opacity": "1", "visibility": "initial", "transform": "translateX(0)", "transition": "all 0.3s"});
            $('.loading-modal').addClass('novload');
            setTimeout(function() {
                $('.loading-modal').css({"opacity": "0", "visibility": "hidden", "transform": "translateX(410px)", "transition": "all 0.3s"});
                $('.loading-modal').removeClass('novload');
            }, 5000);

            if ($('[data-wishlist-container]').length) {
                novtheme.createNovWishListTplItem(ProductHandle);
            };

            wishListsArr.push(ProductHandle);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

        } else {
            self.removeClass('whislist-added');
            self.find('.wishlist-text').text('Add To WishList');

            
            if ($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
            }

            wishListsArr.splice(idxArr, 1);
            localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
        };

        novtheme.setNovAddedForWishlistIcon(ProductHandle);
    });
};
novtheme.createNovWishListTplItem = function(ProductHandle) {
  var wishListCotainer = $('[data-wishlist-container]');

  jQuery.getJSON(window.router + '/products/'+ProductHandle+'.js', function(product) {
    var productHTML = '',
        price_min = Shopify.formatMoney(product.price_min, "$");

        productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
        productHTML += '<div class="inner item-product row align-items-center" data-product-id="product-'+product.handle+'">';
        productHTML += '<div class="column_content col-xl-5 col-lg-5 col-md-4 col-sm-12 col-xs-12"><div class="product-image">';
        productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
        productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
        productHTML += '</a></div>';
        productHTML += '<div class="product-info">';
        productHTML += '<div class="product-title">';
        productHTML += '<a href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></div></div>';
        productHTML += '<div class="column_content col-xl-3 col-lg-3 col-md-2 col-sm-12 col-xs-12 text-center"><div class="price-box">'+ price_min +'</div></div>';
        productHTML += '<div class="column_content col-xl-2 col-lg-2 col-md-3 col-sm-12 col-xs-12 text-center"><a class="btn whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><i class="fa fa-trash-o" aria-hidden="true"><i class="fa fa-trash-o" aria-hidden="true"></i>translation missing: en.products.product.remove</a></div>';
        productHTML += '<div class="column_content col-xl-2 col-lg-2 col-md-3 col-sm-12 col-xs-12 text-center">';
        productHTML += '<form action="/cart/add" method="post" class="variants formAddToCart" id="-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

    if (product.available) {
        if (product.variants.length == 1) {
            productHTML += '<button class="btn btnAddToCart" type="submit" data-form-id="#-'+product.id+'" ><span>Add to cart</span><span>Add to cart</span></button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
        } 
        if (product.variants.length > 1){
            productHTML += '<a class="btn btnAddToCart" title="'+product.title+'" href="'+product.url +'"><i class="zmdi zmdi-check"></i><span>Select Options</span></a>';
        }
    }
    else {
        productHTML += '<button class="btn btnAddToCart" type="button" disabled="disabled">Unavailable</button>';
    } 

    productHTML += '</form></div>';

    productHTML += '</div></div>';

    wishListCotainer.append(productHTML);
  });
};
novtheme.popupCart = function(e) {
    $(document).on('click', '.popupCartClose', function(e) {
        e.preventDefault();
        $("#popup-Cart .jsPopupview").html('');
        $('#popup-Cart').modal('toggle');
    });
};
novtheme.click_button_canvas_menu = function() {
    $('#show-megamenu').on("click", function() {
        if ($('.canvas-menu').hasClass('active')) {
            $('.canvas-menu').removeClass('active');
            $('body').removeClass('canvasmenu-right');
            $(this).removeClass('close');
        } else {
            $('.canvas-menu').addClass('active');
            $('body').addClass('canvasmenu-right');
            $(this).addClass('close');
        }
        return false;
    });
}
novtheme.load_canvas_menu = function() {
    var $main_menu = $(".site-nav", "#AccessibleNav");
    if (current_width <= 768) {
        if ($("#canvas-main-menu").length < 1 && $main_menu.length > 0) {
            var $menu = $main_menu.parent().clone();
            $menu.attr("id", "canvas-main-menu");
            $($menu).find(".menu").removeAttr('id');
            $('.canvas-menu').append($menu);
            $menu.mmenu({
                offCanvas: false,
                "navbar": {
                    "title": false
                }
            });
            novtheme.remove_canvas_menu();
        }
    }
}
novtheme.remove_canvas_menu = function() {
    $('.canvas-header-box .close-box, .canvas-overlay').on("click", function() {
        $('.canvas-menu').removeClass('active');
        $('body').removeClass('canvasmenu-right');
        return false;
    });
}
novtheme.ThumbnailProduct = function() {
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var autoplay = $("#productThumbs .owl-carousel").data('autoplay');
    var autoplayTimeout = $("#productThumbs .owl-carousel").data('autoplayTimeout');
    var items = $("#productThumbs .owl-carousel").data('items');
    var margin = $("#productThumbs .owl-carousel").data('margin');
    var nav = $("#productThumbs .owl-carousel").data('nav');
    var dots = $("#productThumbs .owl-carousel").data('dots');
    var loop = $("#productThumbs .owl-carousel").data('loop');
    var items_tablet = $("#productThumbs .owl-carousel").data('items_tablet') ? $("#productThumbs .owl-carousel").data('items_tablet') : 3;
    var items_mobile = $("#productThumbs .owl-carousel").data('items_mobile') ? $("#productThumbs .owl-carousel").data('items_mobile') : 1;
    var center = $("#productThumbs .owl-carousel").data('center') ? $("#productThumbs .owl-carousel").data('center') : false;
    var start = $("#productThumbs .owl-carousel").data('start') ? $("#productThumbs .owl-carousel").data('start') : 0;
    $("#productThumbs .owl-carousel").owlCarousel({
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        lazyLoad: true,
        lazyContent: true,
        loop: loop,
        autoplay: autoplay,
        autoplayTimeout: autoplayTimeout,
        items: items,
        margin: margin,
        rtl: rtl,
        dots: dots,
        nav: nav,
        center: center,
        responsive: {
            0: {
                items: items_mobile,
                center: center,
                margin: 10
            },
            768: {
                items: items_tablet,
                margin: 10
            },
            992: {
                items: items,
                margin: margin
            },
            1200: {
                items: items,
                startPosition: start,
                margin: margin
            },
        }
    });
}

novtheme.RelatedBlog = function() {
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var $this = $('.BlogRelated .owl-carousel');
    var autoplay = $($this).data('autoplay');
    var autoplayTimeout = $($this).data('autoplayTimeout');
    var items = $($this).data('items');
    var margin = $($this).data('margin');
    var nav = $($this).data('nav');
    var dots = $($this).data('dots');
    var loop = $($this).data('loop');
    var items_tablet = $($this).data('items_tablet') ? $($this).data('items_tablet') : 3;
    var items_mobile = $($this).data('items_mobile') ? $($this).data('items_mobile') : 1;
    var center = $($this).data('center') ? $($this).data('center') : false;
    var start = $($this).data('start') ? $($this).data('start') : 0;
    $($this).owlCarousel({
        navText: ['<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
        lazyLoad: true,
        lazyContent: true,
        loop: loop,
        autoplay: autoplay,
        autoplayTimeout: autoplayTimeout,
        items: items,
        margin: margin,
        rtl: rtl,
        dots: dots,
        nav: nav,
        responsive: {
            0: {
                items: items_mobile,
                center: center,
                margin: 10
            },
            768: {
                items: items_tablet,
                margin: 10
            },
            992: {
                items: items,
                margin: margin
            },
            1200: {
                items: items,
                startPosition: start,
                margin: margin
            },
        }
    });
}

novtheme.callbackReview = function() {
    if ($(".shopify-product-reviews-badge").length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
    };
}
//Countdown
novtheme.Countdown = function() {
    $('[data-countdown]').each(function() {
        var $this = $(this), finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function(event) {
            //var totalHours = event.offset.totalDays * 24 + event.offset.hours;
            var countdown_format = '<div class="item-time"><span class="data-time"><span class="data-number">%D</span><span class="name-time">Days</span></div>'
                               + '<div class="item-time"><span class="data-time"><span class="data-number">%H</span><span class="name-time">Hours</span></div>'
                               + '<div class="item-time"><span class="data-time"><span class="data-number">%M</span><span class="name-time">Mins</span></div>'
                               + '<div class="item-time"><span class="data-time"><span class="data-number">%S</span><span class="name-time">Secs</span></div>';
            $this.html(event.strftime(countdown_format));
        });
    });
}
novtheme.productPage = function(options) {
    var moneyFormat = options.money_format,
        variant = options.variant,
        selector = options.selector;
    var $productImage = $('#ProductPhotoImg'),
        $addToCart = $('#AddToCart'),
        $productPrice = $('#ProductPrice-nov-product-template'),
        $comparePrice = $('#ComparePrice-nov-product-template'),
        $quantityElements = $('.quantity-selector, label + .js-qty'),
        $quantity = $('.product-form__item--quantity'),
        $addToCartText = $('#AddToCartText');
    if (variant) {
            var form = $('#' + selector.domIdPrefix).closest('form');
            for (var i = 0, length = variant.options.length; i < length; i++) {
                var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] + '"]');
                if (radioButton.size()) {
                    radioButton.get(0).checked = true;
                }
            }
        if (variant.featured_image) {
            var newImage = variant.featured_image;
            var element = $productImage[0];
            Shopify.Image.switchImage(newImage, element, function(src, imgObject, el) {
                $('.thumblist img').each(function() {
                    var idProductImage = $(this).parent().data('image');
                    if (idProductImage == src) {
                        $(this).parent().trigger('click');
                        return false;
                    }
                });
            });
        }
        if (variant.available) {
            $quantity.show();
            $addToCart.removeClass('disabled').prop('disabled', false);
            $addToCartText.html("Add to cart");
            $quantityElements.show();
            $('.group-quantity .control-label').show();
            $('.group-quantity').css('margin-top', '0');
        } else {
            $quantity.hide();
            $addToCart.addClass('disabled').prop('disabled', true);
            $addToCartText.html("Sold out");
            $quantityElements.hide();
            $('.group-quantity .control-label').hide();
            $('.group-quantity').css('margin-top', '30px');
        }
        $productPrice.html(theme.Currency.formatMoney(variant.price, moneyFormat));
        if (variant.compare_at_price > variant.price) {
            $comparePrice.html(theme.Currency.formatMoney(variant.compare_at_price, moneyFormat)).show();
        } else {
            $comparePrice.hide();
        }
        if ($('#currencies').length != 0) {
            Currency.convertAll(shopCurrency, $('#currencies span.selected').attr('data-currency'));
        }
    } else {
        $quantity.removeClass('d-block');
        $addToCart.addClass('disabled').prop('disabled', true);
        $addToCartText.html("Unavailable");
        $quantityElements.hide();
    }
}
novtheme.productImageSwitch = function() {
    if (novtheme.cache.$thumbImages.length) {
        $('.thumbItem').each(function() {
            if ($('.thumb_all_variant').length == 0) {
                var srcproFeatured = $('#ProductPhotoImg').attr('src');
                var srcthumnail = $('.product-single__thumbnail', this).attr('data-image');
                if (srcproFeatured == srcthumnail) {
                    $(this).addClass('active');
                };
            }
        });
        novtheme.cache.$thumbImages.on('click', function(evt) {
            evt.preventDefault();
            var newImage = $(this).attr('data-image');
            $('.thumbItem').removeClass('active');
            $(this).parent().addClass('active');
            novtheme.switchImage(newImage, null, novtheme.cache.$productImage);
            $('.zoomImg').attr('src', newImage);
        });
    }
}
novtheme.switchImage = function(src, imgObject, el) {
    var $el = $(el);
    $el.attr('src', src);
}

novtheme.cacheSelectors = function() {
    novtheme.cache = {
        $html: $('html'),
        $body: $(document.body),
        $navigation: $('#AccessibleNav'),
        $mobileSubNavToggle: $('.mobile-nav__toggle'),
        $changeView: $('.change-view'),
        $productImage: $('#ProductPhotoImg'),
        $thumbImages: $('#productThumbs').find('a.product-single__thumbnail'),
        $thumbItem: $('.thumb_grid').find('.thumbItem'),
        
        $recoverPasswordLink: $('#RecoverPassword'),
        $hideRecoverPasswordLink: $('#HideRecoverPasswordLink'),
        $recoverPasswordForm: $('#RecoverPasswordForm'),

        $recoverPasswordIndex: $('#RecoverPasswordIndex'),
        $hideRecoverPasswordIndex: $('#HideRecoverPasswordIndex'),
        $recoverPasswordFormIndex: $('#RecoverPasswordFormIndex'),

        $customerLoginForm: $('#CustomerLoginForm'),
        $passwordResetSuccess: $('#ResetSuccess')
    };
}
novtheme.hoverBlockCart = function(e) {
    $('#cart_block').on("click", function(e) {
        $("#cart-info").slideDown('fast');
        e.stopPropagation();
    });
    $(document).on('click', function(event) {
        if ($(event.target).is('#cart_block #cart-info') == !1) {
            $("#cart-info").slideUp('fast');
        }
    });
}
novtheme.NovToggleAction = function() {
    $(document).on('click', function(f) {
        if ($(f.target).is('.nov_sideward') == false) {
            $('.nov-toggle').removeClass('active');
            $('.nov-toggle .nov-toggle-btn').removeClass('act');
            $('.canvas-overlay').removeClass('act');
        }
        if ($(f.target).is('.nov-toggle .nov-toggle-btn') == true) {
            $('.nov-toggle').removeClass('active');
            $('.nov-toggle .nov-toggle-btn').removeClass('act');
            $('.canvas-overlay').removeClass('act');
        }
    });
}
novtheme.NovToggleSearch = function() {
    $('.search-toggle').on('click.break', function(event) {
        var wrapper = $('.overlay-search');
        wrapper.toggleClass('open');
        $('.search-bar__form .search-bar__input').focus();
    });
    $('.close-search', '.overlay-search').on('click.break', function(event) {
        var wrapper = $('.overlay-search');
        wrapper.toggleClass('open');
    });
}
novtheme.NovTogglePage = function() {
    $('.nov-toggle-page').on('click', function(e) {
        var target = $(this).data('target');
        $('body').hasClass('show-boxpage') ? ($('body').removeClass('show-boxpage')) : ($('body').addClass('show-boxpage'));
        $(target).hasClass('active') ? ($(target).removeClass('active')) : ($(target).addClass('active'));
        e.preventDefault();
    });
    $('.box-header .close-box').on('click', function(e) {
        $('body').removeClass('show-boxpage');
        $(this).parents('.mobile-boxpage').removeClass('active');
        $('.back-box', '#mobile-pageaccount').removeClass('active');
        $('#mobile-pageaccount').find('.box-content').removeClass('active');
        e.preventDefault();
    });
    $('.links-currency, .links-language').on('click', function(e) {
        var target_link = $(this).data('target'),
            title_box = $(this).data('titlebox');
        $('#mobile-pageaccount').find('.box-content').removeClass('active');
        $('.title-box', '#mobile-pageaccount').html(title_box);
        $('.back-box', '#mobile-pageaccount').addClass('active');
        $(target_link).hasClass('active') ? ($(target_link).removeClass('active')) : ($(target_link).addClass('active'));
        e.preventDefault();
    });
    $('.back-box', '#mobile-pageaccount').on('click', function(e) {
        var titlebox_parent = $('#mobile-pageaccount').data('titlebox-parent');
        $('#mobile-pageaccount').find('.box-content').removeClass('active');
        $('.title-box', '#mobile-pageaccount').html(titlebox_parent);
        $(this).removeClass('active');
        e.preventDefault();
    })
}
novtheme.NovHeightBoxContent = function() {
    var height = $(window).outerHeight(),
        boxheight = $('.box-header').outerHeight(),
        menubottom = $('#stickymenu_bottom_mobile').outerHeight();
    $('.box-content', '.mobile-boxpage').each(function() {
        $(this).outerHeight(height - 45);
    });
}
novtheme.NovEventClickSearchMobile = function() {
    $('#stickymenu_bottom_mobile .js-btn-search').click(function() {
        $('#mobile_search .search-header__input').focus();
        $("body,html").animate({
            scrollTop: 0
        }, "normal");
    })
}

novtheme.goToTop = function() {
    var timer;
    $(window).scroll(function () {
        if (timer)
            clearTimeout(timer)
        timer = setTimeout(function () {
            if ($(window).scrollTop() >= 200) {
                $('#_desktop_back_top').fadeIn();
            } else {
                $('_desktop_back_top').fadeOut();
            }
        }, 300);

    });
    $("#_desktop_back_top").click(function () {
        $("body,html").animate({scrollTop: 0}, "normal");
        return!1
    });
}
novtheme.goToTopMobile = function() {
    if ($(window).width() < 768) {
        var timer;
        $(window).scroll(function() {
            if (timer) clearTimeout(timer)
            timer = setTimeout(function() {
                $('#back_top').fadeIn();
            }, 200);
        });
        $("#back_top").click(function() {
            $("body,html").animate({
                scrollTop: 0
            }, "normal");
            return !1
        });
    }
}

novtheme.PopupNewletter = function() {
    var date = new Date();
    var minutes = 60;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    if ($.cookie('popupNewLetterStatus') != 'closed' && $('body').outerWidth() > 768) {
        $("#popup-subscribe").modal({
            show: !0
        });
    }
    $.cookie("popupNewLetterStatus", "closed", {
        'expires': date,
        'path': '/'
    })
    $('input.no-view').change(function() {
        if ($('input.no-view').prop("checked") == 1) {
            $.cookie("popupNewLetterStatus", "closed", {
                'expires': date,
                'path': '/'
            })
        } else {
            $.cookie("popupNewLetterStatus", "", {
                'expires': date,
                'path': '/'
            })
        }
    })
}

novtheme.variantName = function() {
    if ($('.template-product .thumb_grid').length > 0) {
        var val = $('.swatch[data-option-index="1"] .swatch-element input:checked').parent().data('value');
        $('.thumbItem[data-variant="'+val+'"]').addClass('show');
        
        $('.swatch[data-option-index="1"] .swatch-element label').on('click', function() {
            var value = $(this).parent().data('value');
            $('.thumbItem').removeClass('show');
            $('.thumbItem[data-variant="'+value+'"]').addClass('show');
        }); 
    }
}

novtheme.MenuSidebar = function() {
    $('.categories__sidebar .hasSubCategory a').each(function(index) {
        if ($(this).hasClass('active')) {
            $(this).parent().children('.collapse').collapse('show');
        }
    })
}


//Thumnail Slick Product Deal
novtheme.Product__Thumnail = function() {
    $('.product-thumb .item-product').each(function (index) {
        var asNavFor_nav = $('.thumnailslider-for', this).data('asnavfornav');
        var autoplay = $('.thumnailslider-nav', this).data('autoplay');
        var autoplayTimeout = $('.thumnailslider-nav', this).data('autoplayTimeout');
        var items = $('.thumnailslider-nav', this).data('items');
        var items_lg_tablet = $('.thumnailslider-nav', this).data('items_lg_tablet');
        var items_tablet = $('.thumnailslider-nav', this).data('items_tablet');
        var items_mobile = $('.thumnailslider-nav', this).data('items_mobile');
        var items_mobiles = $('.thumnailslider-nav', this).data('items_mobiles');
        var margin = $('.thumnailslider-nav', this).data('margin');
        var nav = $('.thumnailslider-nav', this).data('nav');
        var dots = $('.thumnailslider-nav', this).data('dots');
        var loop = $('.thumnailslider-nav', this).data('loop');
        var vertical = $('.thumnailslider-nav', this).data('vertical');
        var position = $('.thumnailslider-nav', this).find('.selected').data('position-image');
        var asNavFor_for = $('.thumnailslider-nav', this).data('asnavforfor');
        if ($('html').hasClass('lang-rtl'))
            var rtl = true;
        else
            var rtl = false;
        $(asNavFor_for, this).slick({
            rtl: rtl,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            fade: true,
            loop: false,
            arrows: false,
            asNavFor: asNavFor_nav
        });
        $(asNavFor_nav, this).slick({
            rtl: rtl,
            slidesToShow: items,
            slidesToScroll: 1,
            asNavFor: asNavFor_for,
            centerMode: false,
            loop: false,
            focusOnSelect: true,
            dots: false,
            arrows: false,
            responsive: [
                {
                    breakpoint: 1920,
                    settings: {
                        slidesToShow: items
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: items_lg_tablet
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: items_tablet,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: items_mobile,
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: items_mobiles,
                    }
                }
            ]
        });
    })
}

// Parallax Image
novtheme.ParallaxImage = function() {
    if ($('.section-image-parallax').length) {
        $('.section-image-parallax').each(function(){
            var winHeight = $(window).height(),
                section_id = $(this).children().data('section-id'),
                Event = false,
                offset_top = $(this).offset().top,
                distance = offset_top - winHeight;
            $(window).scroll(function(){
                var currentPosition = $(window).scrollTop();
                if (currentPosition > distance && Event === false) {
                    Event = true;
                    $(window).scroll(function(){
                        $('.section-image-parallax').each(function(){
                            var winHeight = $(window).height();
                            var currentPosition = $(window).scrollTop();
                            var section_id = $(this).children().data('section-id'),
                            offset_top = $(this).offset().top;
                            distance = offset_top - winHeight;
                            var scrolled = (currentPosition - distance)*0.02;
                            console.log(section_id);
                            $('#shopify-section-'+section_id+' img').css('transform', 'translateY('+ scrolled+'px) scale(1.3, 1.3)');
                            $('#shopify-section-'+section_id+' .reverse_parallax img').css('transform', 'translateY(-'+ scrolled+'px) scale(1.3, 1.3)');
                        })
                    });
                }   
            });
        })
    }
}
novtheme.SlideShowSplit = function() {
    $('.nov-slide-split').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: true,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 1500,
        arrows: false,
        dots:false,
        pauseOnHover: false,
        pauseOnFocus: false,
        swipe: false
    });
}


novtheme.NovAccordion = function() {
    $('.nov-accordion__title').click(function () {
        if ($(this).hasClass("act")) {
            $(this).removeClass("act"),
            $(this).parent().find('.nov-accordion__content').slideUp()
        } else {
            $(this).parents('.nov-accordion').find('.nov-accordion__title').removeClass('act'),
            $(this).parents('.nov-accordion').find('.nov-accordion__content').slideUp(),
            $(this).addClass('act'),
            $(this).parent().find('.nov-accordion__content').slideDown()
        }
    })
};
novtheme.CollectionPage = function() {
    if (localStorage.getItem('view_collection')) {
       $('.collection__product-content').attr('data-grid', localStorage.getItem('view_collection'));
       $('.gridlist-toggle a').removeClass('active');
       $('.gridlist-toggle [data-type="'+ localStorage.getItem('view_collection') +'"]').addClass('active');
    }
    $('.gridlist-toggle a').click(function(e) {
        e.preventDefault();
        var typeview = $(this).data('type');
        if (!$(this).hasClass('active')) {
            $('.collection__product-content').attr('data-grid', typeview);
            $('.gridlist-toggle a').removeClass('active');
            $(this).addClass('active');
        }
        localStorage.setItem('view_collection', $('.collection__product-content').attr('data-grid'));
    });
    $('.filter_button').click(function(){
        $('.sidebar-filter').addClass('active');
        $('.sidebar-overlay').addClass('act');
    });
    if($(document).width() <992 ) {
        $('.collection__product-content').attr('data-grid', 'grid-3');
        $('.gridlist-toggle a').removeClass('active');
        $('.gridlist-toggle #grid-3').addClass('active');
    }
    if($(document).width() <768 ) {
        $('.collection__product-content').attr('data-grid', 'grid-2');
        $('.gridlist-toggle a').removeClass('active');
        $('.gridlist-toggle #grid-2').addClass('active');
    };
    // Click filter sort by
    var text = $('#FacetsWrapperDesktop [name="sort_by"] [selected="selected"]').text();
    $('[data-sortby-filter] .sort-by__label').text(text);
    $('[data-sortby-item]').click(function () {
        var valuesort = $(this).attr('value');
        var newtext = $(this).text();
        $('[data-sortby-filter] .sort-by__label').text(newtext);
        $('[name="sort_by"]').val(valuesort);
        const form = document.querySelector('facet-filters-form');
        form.onSubmitHandlerSortBy(event, form.querySelector('form'));
    });
    if ($('.reset_price').length) {
        window.onload = function() {
            var min = $('.min_price .money').text().slice(1),
                max = $('.max_price .money').text().slice(1),
                m = $('.filter-max__price').data('max'),
                n = $('.filter-max__price .money').text().slice(1),
                x = m/n;
                $('.facets__price').find("input").first().val(Math.round(min)).attr({'max': Math.round(max), 'data-value': Math.round(max*x)});;
                $('.facets__price').find("input").last().val(Math.round(max)).attr({'max': Math.round(n), 'min': Math.round(min), 'data-value': Math.round(max*x)});
        };
    }
};
$(document).ready(function() {
    var d = $(this),
        mobile = false;
    $(novtheme.init);
    if (responsive_mobile) {
        novtheme.toggleMobileStyles();
    }
    if ($("#popup-subscribe").length) {
        $(window).on('load', function() {
            var timer = window.setTimeout(novtheme.PopupNewletter(), 2000);
        });
    }
    if ($("#popupAlert").length) {
        $(window).on('load', function() {
            $('#popupAlert').modal();
        });
    }
    $(window).on('resize', function() {
        if (d.width() <= 980 && mobile == false) {
            mobile = true;
        } else if (d.width() > 980) {
            mobile = false;
        }
    });
    if ($('html').hasClass('lang-rtl'))
        var rtl = true
    else
        var rtl = false
    $('#productThumbs .nov-thumb_vertical').slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-down"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-up"></i></div>',
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 3,
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        responsive: [{
            breakpoint: 1200,
            settings: {
                verticalSwiping: false,
                slidesToShow: 4,
                slidesToScroll: 3,
                arrows: false
            }
        }, {
            breakpoint: 992,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 4
            }
        }, {
            breakpoint: 768,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 3
            }
        }, {
            breakpoint: 480,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 2
            }
        }]
    });
    $('.block_img_left .nov-thumb_vertical').slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-down"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-up"></i></div>',
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 3,
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        responsive: [{
            breakpoint: 1200,
            settings: {
                verticalSwiping: false,
                slidesToShow: 4,
                slidesToScroll: 3,
                arrows: false
            }
        }, {
            breakpoint: 992,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 4
            }
        }, {
            breakpoint: 768,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 4,
                slidesToScroll: 3
            }
        }, {
            breakpoint: 480,
            settings: {
                vertical: false,
                verticalSwiping: false,
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 2
            }
        }]
    });
    
    // verical menu
    $('.vertical_menu .show_sub').click(function(e){
        $(this).parent().each(function(){
            e.preventDefault();
        });
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parent().parent('.site-nav--has-dropdown').children('.site-nav__dropdown').slideUp(300);
            $(this).children().addClass('zmdi-plus-square').removeClass('zmdi-minus-square');
        } else {
            $(this).addClass('active').parent().parent('.site-nav--has-dropdown').children('.site-nav__dropdown').slideDown(300);
            $(this).children().addClass('zmdi-minus-square').removeClass('zmdi-plus-square');
        }
        $('.vertical_menu .show_sub').not(this).removeClass('active').parent().parent('.site-nav--has-dropdown').children('.site-nav__dropdown').slideUp(300);
        $('.vertical_menu .show_sub').not(this).children().removeClass('zmdi-minus-square').addClass('zmdi-plus-square');
    });

    // mobile vertical sidebar
    $(".btn-mobile_vertical_menu").click(function(){
        $("#_mobile_vertical_menu").addClass('active');
        $("#_mobile_sidebarmenu_content").addClass('active');
        $(".sidebar-overlay").addClass('act');
    });

    
    if($(document).width() < 992 ) {
        if ($('.vertical_menu').length >0) {
            $(".site-header .title_vertical").show(); 
            $(".btn-mobile_vertical_menu").show();
        }
        $('.title_vertical').click(function(){
            $("#_desktop_vertical_menu").addClass('active');
            $(".sidebar-overlay").addClass('act');
        });
    }

    var show_more = $(".vertical_menu").data('count_showmore');
    var show_more_lg = $(".vertical_menu").data('count_showmore_lg') - 1;
    var textshowmore = $(".vertical_menu").data('textshowmore');
    var textless = $(".vertical_menu").data('textless');
    
    if ($('.vertical_menu>ul>li').length > show_more) {
        $(".vertical_menu .show_more").removeClass('hidden');
    }
    if ($(document).width() < 1200) {
        $('#_desktop_vertical_menu .site-nav>li:gt('+ show_more_lg +')').addClass('hide');
        if ($('.vertical_menu>ul>li').length > show_more_lg) {
            $(".vertical_menu .show_more").removeClass('hide');
        }
    };
    $('.show_more').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).text(textshowmore)
        } else {
            $(this).addClass('active');
            $(this).text(textless)
        }
        if ($('.vertical_menu>ul>li').hasClass('hide')) {
            $('.vertical_menu>ul>li.hide').slideToggle(300);
        }
    });

    $(".sidebar-overlay").click(function() {
        $(this).removeClass('act');
        $("#_mobile_vertical_menu").removeClass('active');
        $(".btn_active").css('opacity', '1');
        $('.vertical_dropdown').removeClass('active');
        $("#_desktop_vertical_menu").removeClass('active');
        $('.sidebar-filter').removeClass('active');
    });

    //Related Product
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var autoplay = $(".owl-relatedproduct").data('autoplay');
    var autoplayTimeout = $(".owl-relatedproduct").data('autoplayTimeout');
    var items = $(".owl-relatedproduct").data('items');
    var margin = $(".owl-relatedproduct").data('margin');
    var nav = $(".owl-relatedproduct").data('nav');
    var dots = $(".owl-relatedproduct").data('dots');
    var loop = $(".owl-relatedproduct").data('loop');
    var items_tablet = $(".owl-relatedproduct").data('items_tablet') ? $(".owl-relatedproduct").data('items_tablet') : 3;
    var items_mobile = $(".owl-relatedproduct").data('items_mobile') ? $(".owl-relatedproduct").data('items_mobile') : 1;
    var center = $(".owl-relatedproduct").data('center') ? $(".owl-relatedproduct").data('center') : false;
    var start = $(".owl-relatedproduct").data('start') ? $(".owl-relatedproduct").data('start') : 0;
    $(".owl-relatedproduct").owlCarousel({
        navText: ['<i class="zmdi zmdi-caret-left"></i>', '<i class="zmdi zmdi-caret-right"></i>'],
        lazyLoad: true,
        lazyContent: true,
        loop: loop,
        autoplay: autoplay,
        autoplayTimeout: autoplayTimeout,
        items: items,
        margin: margin,
        rtl: rtl,
        dots: dots,
        nav: nav,
        responsive: {
            0: {
                items: items_mobile,
                center: center,
                margin: 10,
                nav: false
            },
            768: {
                items: items_tablet,
                margin: margin
            },
            992: {
                items: items,
                margin: margin
            },
            1200: {
                items: items,
                startPosition: start,
                margin: margin
            },
        }
    });
    checkClasses();
    $(".owl-relatedproduct").on('translated.owl.carousel', function(event) {
        checkClasses();
    });

    function checkClasses() {
        var total = $('.owl-relatedproduct .owl-stage .owl-item.active').length;
        $('.owl-relatedproduct .owl-stage .owl-item').removeClass('firstActiveItem lastActiveItem');
        $('.owl-relatedproduct .owl-stage .owl-item.active').each(function(index) {
            if (index === 0) {
                $(this).addClass('firstActiveItem');
            }
            if (index === total - 1 && total > 1) {
                $(this).addClass('lastActiveItem');
            }
        });
    }
    novtheme.NovMediumToggle = function() {
        $('.card-header').on("click", function(e) {
            $(this).hasClass("active") ? ($(this).removeClass('active')) : ($(this).addClass('active'))
        });
    }


    novtheme.HideShowPassword = function() {
        $('.hide_show_password').show();
        $('.hide_show_password span').addClass('show')
          
        $('.hide_show_password span').click(function(){
            if( $(this).hasClass('show')) {
                $(this).html('<i class="zmdi zmdi-eye"></i>');
                $('input[name="customer[password]"]').attr('type','text');
                $(this).removeClass('show');
            } else {
                $(this).html('<i class="zmdi zmdi-eye-off"></i>');
                $('input[name="customer[password]"]').attr('type','password');
                $(this).addClass('show');
            }
        });
            
        $('form button[type="submit"]').on('click', function(){
            $('.hide_show_password span').text('Show').addClass('show');
            $('.hide_show_password').parent().find('input[name="customer[password]"]').attr('type','password');
        });
    }

    // Toggle Search
    novtheme.NovSearchToggle = function() {
        $('.search-button').on("click", function(e) {
            $(this).parent(".site-header__search").hasClass("search-active") ? ($(this).parent(".site-header__search").removeClass('search-active')) : ($(this).hide().parent(".site-header__search").addClass('search-active'));
            e.stopPropagation()
        });
        $(document).on('click', function(event) {
            if ($(event.target).is('#search_widget input') == !1) {
                $('.site-header__search').removeClass("search-active");
                $('.search-button').show()
            }
        })
    }

    // Section product slider testimonial
    $('.section-product-slider .testimonials-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    });

    // Animate load wislist page detail
    $('.group-quantity .btnProductWishlist').click(function () {
        if($(this).hasClass('whislist-added')) {
            $('#popup-Wishlist').removeClass('novload')
        } else {
            $('#popup-Wishlist').addClass('novload')
        }
    })

    //Sticky page cart
    if ($('.template-cart').length > 0 ) {
        novtheme.NovStickIn = function() {
            $(".cart__layout_right").stick_in_parent({
                offset_top: 60
            });
        }
    }
    var $productImageZoom = $('.image-zoom');
    $productImageZoom.trigger('zoom.destroy');
    $productImageZoom
    .wrap('<span class="w-100" style="display:inline-block"></span>')
    .css('display', 'block')
    .parent()
    .zoom({
    url: $(this).find('img').attr('data-zoom')
    });

    // Vue js
    new Vue({
        el: '#nov-vue-carousel-3d',
        data: {
        slides: 7
        },
        components: {
        'carousel-3d': window['carousel-3d'].Carousel3d,
        'slide': window['carousel-3d'].Slide
        },
        methods: {
            goToSlide(index) {
              this.$refs.mycarousel.goSlide(index)
            }
        }
    });
    $('#nov-vue-carousel-3d .btn_nav').click(function(){
        $('.btn_nav').removeClass('active');
        $(this).addClass('active');
    })

    // Change column section collection tabs
    $('.s-c-t a').click(function(e) {
        e.preventDefault();
        var typeview = $(this).data('type');
        if (!$(this).hasClass('active')) {
            $('.type-grid').removeClass('view_4 view_3 view_2');
            $('.type-grid').addClass(typeview);
            $('.s-c-t a').removeClass('active');
            $(this).addClass('active');
        }
    });
    $('.tab-links').click(function(e) {
        var target_link = $(this).data('target');
        $('.section-collection-tabs .view_all a').removeClass('act');
        $('.section-collection-tabs .view_all a[data-id="'+ target_link +'"]').addClass('act');
    });
});