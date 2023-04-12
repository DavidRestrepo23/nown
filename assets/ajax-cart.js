if ((typeof ShopifyAPI) === 'undefined') {
    ShopifyAPI = {};
}

function attributeToString(attribute) {
    if ((typeof attribute) !== 'string') {
        attribute += '';
        if (attribute === 'undefined') {
            attribute = '';
        }
    }
    return jQuery.trim(attribute);
};
ShopifyAPI.onCartUpdate = function(cart) {};
ShopifyAPI.updateCartNote = function(note, callback) {
    var $body = $(document.body),
        params = {
            type: 'POST',
            url: '/cart/update.js',
            data: 'note=' + attributeToString(note),
            dataType: 'json',
            beforeSend: function() {
                $body.trigger('beforeUpdateCartNote.ajaxCart', note);
            },
            success: function(cart) {
                if ((typeof callback) === 'function') {
                    callback(cart);
                } else {
                    ShopifyAPI.onCartUpdate(cart);
                }
                $body.trigger('afterUpdateCartNote.ajaxCart', [note, cart]);
            },
            error: function(XMLHttpRequest, textStatus) {
                $body.trigger('errorUpdateCartNote.ajaxCart', [XMLHttpRequest, textStatus]);
                ShopifyAPI.onError(XMLHttpRequest, textStatus);
            },
            complete: function(jqxhr, text) {
                $body.trigger('completeUpdateCartNote.ajaxCart', [this, jqxhr, text]);
            }
        };
    jQuery.ajax(params);
};
ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    if (!!data.message) {
        alert(data.message + '(' + data.status + '): ' + data.description);
    }
};
ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
//     var $body = $(document.body),
//         params = {
//             type: 'POST',
//             url: '/cart/add.js',
//             data: jQuery(form).serialize(),
//             dataType: 'json',
//             beforeSend: function(jqxhr, settings) {
//                 $body.trigger('beforeAddItem.ajaxCart', form);
//             },
//             success: function(line_item) {
//                 if ((typeof callback) === 'function') {
//                     callback(line_item, form);
//                 } else {
//                     ShopifyAPI.onItemAdded(line_item, form);
//                 }
//                 $body.trigger('afterAddItem.ajaxCart', [line_item, form]);
//             },
//             error: function(XMLHttpRequest, textStatus) {
//                 if ((typeof errorCallback) === 'function') {
//                     errorCallback(XMLHttpRequest, textStatus);
//                 } else {
//                     ShopifyAPI.onError(XMLHttpRequest, textStatus);
//                 }
//                 $body.trigger('errorAddItem.ajaxCart', [XMLHttpRequest, textStatus]);
//             },
//             complete: function(jqxhr, text) {
//                 $body.trigger('completeAddItem.ajaxCart', [this, jqxhr, text]);
//             }
//         };
//     jQuery.ajax(params);
};
ShopifyAPI.getCart = function(callback) {
//     $(document.body).trigger('beforeGetCart.ajaxCart');
//     jQuery.getJSON('/cart.js', function(cart, textStatus) {
//         if ((typeof callback) === 'function') {
//             callback(cart);
//         } else {
//             ShopifyAPI.onCartUpdate(cart);
//         }
//         $(document.body).trigger('afterGetCart.ajaxCart', cart);
//     });
};
ShopifyAPI.changeItem = function(line, quantity, callback) {
    var $body = $(document.body),
        params = {
            type: 'POST',
            url: '/cart/change.js',
            data: 'quantity=' + quantity + '&line=' + line,
            dataType: 'json',
            beforeSend: function() {
                $body.trigger('beforeChangeItem.ajaxCart', [line, quantity]);
            },
            success: function(cart) {
                if ((typeof callback) === 'function') {
                    callback(cart);
                } else {
                    ShopifyAPI.onCartUpdate(cart);
                }
                $body.trigger('afterChangeItem.ajaxCart', [line, quantity, cart]);
            },
            error: function(XMLHttpRequest, textStatus) {
                $body.trigger('errorChangeItem.ajaxCart', [XMLHttpRequest, textStatus]);
                ShopifyAPI.onError(XMLHttpRequest, textStatus);
            },
            complete: function(jqxhr, text) {
                $body.trigger('completeChangeItem.ajaxCart', [this, jqxhr, text]);
            }
        };
    jQuery.ajax(params);
};
var ajaxCart = (function(module, $) {
    'use strict';
    var init, loadCart;
    var settings, isUpdating, $body;
    var $formContainer, $addToCart, $cartCountSelector, $cartCostSelector, $cartContainer, $drawerContainer;
    var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty;
    init = function(options) {
        settings = {
            formSelector: 'form[action^="/cart/add"]',
            cartContainer: '#CartContainer',
            addToCartSelector: 'input[type="submit"]',
            cartCountSelector: null,
            cartCostSelector: null,
            moneyFormat: '$',
            disableAjaxCart: false,
            enableQtySelectors: true
        };
        $.extend(settings, options);
        $formContainer = $(settings.formSelector);
        $cartContainer = $(settings.cartContainer);
        $addToCart = $formContainer.find(settings.addToCartSelector);
        $cartCountSelector = $(settings.cartCountSelector);
        $cartCostSelector = $(settings.cartCostSelector);
        $body = $(document.body);
        isUpdating = false;
        if (settings.enableQtySelectors) {
            qtySelectors();
        }
        if (!settings.disableAjaxCart && $addToCart.length) {
            formOverride();
        }
        adjustCart();
    };
    loadCart = function() {
//         ShopifyAPI.getCart(cartUpdateCallback);
    };
    updateCountPrice = function(cart) {
        if ($cartCountSelector) {
            
            $cartCountSelector.html(cart.item_count).removeClass('hidden-count');
            $('.cart-products-count').html(cart.item_count);
            if (cart.item_count === 0) {
                $cartCountSelector.addClass('hidden-count');
            }
        }
        if ($cartCostSelector) {
            $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
        }
    };
    formOverride = function() {
//         $formContainer.on('submit', function(evt) {
//             evt.preventDefault();
//             $addToCart.removeClass('is-added').addClass('is-adding');
//             $('.qty-error').remove();
//             ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
//         });
    };
    itemAddedCallback = function(product) {
        $addToCart.removeClass('is-adding').addClass('is-added');
        ShopifyAPI.getCart(cartUpdateCallback);
    };
    itemErrorCallback = function(XMLHttpRequest, textStatus) {
        var data = eval('(' + XMLHttpRequest.responseText + ')');
        $addToCart.removeClass('is-adding is-added');
        // if (!!data.message) {
        //     if (data.status == 422) {
        //         $formContainer.after('<div class="errors qty-error">' + data.description + '</div>')
        //     }
        // }
    };
    cartUpdateCallback = function(cart) {
        updateCountPrice(cart);
        buildCart(cart);
    };
    buildCart = function(cart) {
        $cartContainer.empty();
        if (cart.item_count === 0) {
            $cartContainer.append('<p class="cart empty">' + "Your cart is currently empty." + '</p>');
            cartCallback(cart);
            return;
        }
        if (cart.items.length > 2) {
            $cartContainer.addClass('has-scroll');
        } else {
            $cartContainer.removeClass('has-scroll');
        }
        var items = [],
            item = {},
            data = {},
            source = $("#CartTemplate").html(),
            template = Handlebars.compile(source);
        $.each(cart.items, function(index, cartItem) {
            if (cartItem.image != null) {
                var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
            } else {
                var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
            }
            item = {
                key: cartItem.key,
                line: index + 1,
                url: cartItem.url,
                img: prodImg,
                name: cartItem.product_title,
                variation: cartItem.variant_title,
                properties: cartItem.properties,
                itemAdd: cartItem.quantity + 1,
                itemMinus: cartItem.quantity - 1,
                itemQty: cartItem.quantity,
                price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
                vendor: cartItem.vendor,
                linePrice: Shopify.formatMoney(cartItem.line_price, settings.moneyFormat),
                originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat),
                discounts: cartItem.discounts,
                discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
            };
            items.push(item);
        });
        data = {
            items: items,
            note: cart.note,
            totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat),
            totalCartDiscount: cart.total_discount === 0 ? 0 : "translation missing: en.cart.general.savings_html".replace('[savings]', Shopify.formatMoney(cart.total_discount, settings.moneyFormat)),
            totalCartDiscountApplied: cart.total_discount === 0 ? false : true
        }
        $cartContainer.append(template(data));
        cartCallback(cart);
        if ($('#currencies').length != 0) {
            Currency.convertAll(shopCurrency, $('#currencies span.selected').attr('data-currency'));
        }
    };
    cartCallback = function(cart) {
        $body.removeClass('drawer--is-loading');
        $body.trigger('afterCartLoad.ajaxCart', cart);
        if (window.Shopify && Shopify.StorefrontExpressButtons) {
            Shopify.StorefrontExpressButtons.initialize();
        }
    };
    adjustCart = function() {
        $body.on('click', '.ajaxcart__qty-adjust', function() {
            if (isUpdating) {
                return;
            }
            var $el = $(this),
                line = $el.data('line'),
                $qtySelector = $el.siblings('.ajaxcart__qty-num'),
                qty = parseInt($qtySelector.val().replace(/\D/g, ''));
            var qty = validateQty(qty);
            if ($el.hasClass('ajaxcart__qty--plus')) {
                qty += 1;
            } else {
                qty -= 1;
                if (qty <= 0) qty = 0;
            }
            if (line) {
                updateQuantity(line, qty);
            } else {
                $qtySelector.val(qty);
            }
        });
        $body.on('change', '.ajaxcart__qty-num', function() {
            if (isUpdating) {
                return;
            }
            var $el = $(this),
                line = $el.data('line'),
                qty = parseInt($el.val().replace(/\D/g, ''));
            var qty = validateQty(qty);
            if (line) {
                updateQuantity(line, qty);
            }
        });
        $body.on('submit', 'form.ajaxcart', function(evt) {
            if (isUpdating) {
                evt.preventDefault();
            }
        });
        $body.on('focus', '.ajaxcart__qty-adjust', function() {
            var $el = $(this);
            setTimeout(function() {
                $el.select();
            }, 50);
        });
//         $body.on('click', '.remove-from-cart', function(evt) {
//             evt.preventDefault();
//             var $el = $(this),
//                 line = $el.data('line'),
//                 qty = 0;
//             if (line) {
//                 updateQuantity(line, qty);
//             }
//         });

        function updateQuantity(line, qty) {
            isUpdating = true;
            var $row = $('.ajaxcart__row[data-line="' + line + '"]').addClass('is-loading');
            if (qty === 0) {
                $row.parent().addClass('is-removed');
            }
            setTimeout(function() {
                ShopifyAPI.changeItem(line, qty, adjustCartCallback);
            }, 250);
        }
        $body.on('change', 'textarea[name="note"]', function() {
            var newNote = $(this).val();
            ShopifyAPI.updateCartNote(newNote, function(cart) {});
        });
    };
    adjustCartCallback = function(cart) {
        updateCountPrice(cart);
        setTimeout(function() {
            isUpdating = false;
            ShopifyAPI.getCart(buildCart);
        }, 150)
    };
    createQtySelectors = function() {
//         if ($('input[type="number"]', $cartContainer).length) {
//             $('input[type="number"]', $cartContainer).each(function() {
//                 var $el = $(this),
//                     currentQty = $el.val();
//                 var itemAdd = currentQty + 1,
//                     itemMinus = currentQty - 1,
//                     itemQty = currentQty;
//                 var source = $("#AjaxQty").html(),
//                     template = Handlebars.compile(source),
//                     data = {
//                         key: $el.data('id'),
//                         itemQty: itemQty,
//                         itemAdd: itemAdd,
//                         itemMinus: itemMinus
//                     };
//                 $el.after(template(data)).remove();
//             });
//         }
    };
    qtySelectors = function() {
        var numInputs = $('input[type="number"]');
        if (numInputs.length) {
//             numInputs.each(function() {
//                 var $el = $(this),
//                     currentQty = $el.val(),
//                     inputName = $el.attr('name'),
//                     inputId = $el.attr('id');
//                 var itemAdd = currentQty + 1,
//                     itemMinus = currentQty - 1,
//                     itemQty = currentQty;
//                 var source = $("#JsQty").html(),
//                     template = Handlebars.compile(source),
//                     data = {
//                         key: $el.data('id'),
//                         itemQty: itemQty,
//                         itemAdd: itemAdd,
//                         itemMinus: itemMinus,
//                         inputName: inputName,
//                         inputId: inputId
//                     };
//                 $el.after(template(data)).remove();
//             });
//             $('.js-qty__adjust').on('click', function() {
//                 var $el = $(this),
//                     id = $el.data('id'),
//                     $qtySelector = $el.siblings('.js-qty__num'),
//                     qty = parseInt($qtySelector.val().replace(/\D/g, ''));
//                 var qty = validateQty(qty);
//                 if ($el.hasClass('js-qty__adjust--plus')) {
//                     qty += 1;
//                 } else {
//                     qty -= 1;
//                     if (qty <= 1) qty = 1;
//                 }
//                 $qtySelector.val(qty);
//             });
        }
    };
    validateQty = function(qty) {
        if ((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {} else {
            qty = 1;
        }
        return qty;
    };
    module = {
        init: init,
        load: loadCart
    };
    return module;
}(ajaxCart || {}, jQuery));