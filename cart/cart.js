/**
 * Created by Fidelity 2015 on 23/06/2016.
 */

thaiFood.cart = {
    populateCart : function(){
        document.getElementsByClassName('order_list')[0].innerHTML = '';
        document.getElementsByClassName('order_coupon')[0].innerHTML = '';

        if(thaiFood.customerOrder.order.length>0) {
            //Showing all the orders
            for (var i = 0; i < thaiFood.customerOrder.order.length; i++) {
                var orderList = document.getElementsByClassName('order_list');
                orderList[0].innerHTML += '<div class="order_list_item"></div>';
            }

            for (var i = 0; i < thaiFood.customerOrder.order.length; i++) {
                var orderListItem = document.getElementsByClassName('order_list_item');
                var sidePrice = thaiFood.cart.checkSideValue(thaiFood.customerOrder.order[i].with);

                orderListItem[i].innerHTML += '<div class="menu_option_text">' +
                    '<p class="menu_option_name">'  + thaiFood.customerOrder.order[i].quantity + ' x ' + thaiFood.customerOrder.order[i].title + '</p>' +
                    '<p class="menu_option_description">with ' + thaiFood.customerOrder.order[i].with + ' (€' + sidePrice.toFixed(2) + ')</p>' +
                    '</div>' +
                    '<div class="menu_option_nonText">' +
                    '<p class="menu_option_price">€' + thaiFood.cart.calculateItemPrice(thaiFood.customerOrder.order[i].price, thaiFood.customerOrder.order[i].quantity, sidePrice).toFixed(2) + '</p>' +
                    '<p class="menu_option_cancel" onclick="thaiFood.cart.removeItemFromCart(' + i + ')">Cancel</p>' +
                    '</div>';
            }

            thaiFood.cart.populateCoupon();
            thaiFood.cart.populateTotal()
        }
        else{
            var orderList = document.getElementsByClassName('order_list');
            orderList[0].innerHTML += '<div class="order_list_empty">' +
                '<p>You have nothing in your Cart</p></div>';
        }
    },

    populateCoupon : function(){
        if(thaiFood.customerOrder.coupon.id){
            //ready for multiple coupons
            //for(var i=0; i<checkout.coupon.length; i++){
            var couponList = document.getElementsByClassName('order_coupon');
            couponList[0].innerHTML += '<div class="order_coupon_item"></div>';
            //}

            //ready for multiple coupons
            //for(var i=0; i<checkout.coupon.length; i++){
            var couponListItem = document.getElementsByClassName('order_coupon_item');
            couponListItem[0].innerHTML = '<div class="order_coupon_item_name">' +
                '<p>Coupon (' + thaiFood.customerOrder.coupon.redeemValue + '% Off)</p></div>' +
                '<div class="order_coupon_item_value"><p>€' + thaiFood.cart.calculateCouponValue().toFixed(2) + '</p></div>';
            //}
            document.getElementById('addCoupon').style.display = 'none';
            document.getElementById('displayCoupon').style.display = 'block';
        }
        else{
            document.getElementById('addCoupon').style.display = 'block';
            document.getElementById('displayCoupon').style.display = 'none';
        }
    },

    populateTotal : function(){
        if(thaiFood.customerOrder.order.length>0){
            document.getElementsByClassName('order_total')[0].innerHTML =
                '<div class="order_total_title">' +
                '<p>Total</p>' +
                '</div>' +
                '<div class="order_total_amount">' +
                '<p>' + (thaiFood.cart.calculateTotalPrice() - thaiFood.cart.calculateCouponValue()).toFixed(2)  + '</p>' +
                '</div>';
        }
        else{
            document.getElementsByClassName('order_total')[0].innerHTML = '';
        }
    },

    removeItemFromCart : function(itemPosition){
        thaiFood.customerOrder.order.splice(itemPosition, 1);
        thaiFood.cart.populateCart();
        thaiFood.cart.populateCoupon();
        thaiFood.cart.populateTotal();
        thaiFood.cart.checkOrderSize();
    },

    checkOrderSize : function(){
        if(thaiFood.customerOrder.order.length>0){
            document.getElementById('proceedToCheckoutButton').style.display = 'block';
        }
        else{
            document.getElementById('proceedToCheckoutButton').style.display = 'none';
        }
    },

    calculateItemPrice : function(price, quantity, side){
        return (price + side ) * quantity;
    },

    calculateTotalPrice : function(){
        var totalPrice = 0;
        for(var i = 0; thaiFood.customerOrder.order.length>i; i++){
            totalPrice += (thaiFood.customerOrder.order[i].price + thaiFood.cart.checkSideValue(thaiFood.customerOrder.order[i].with )) * thaiFood.customerOrder.order[i].quantity;
        }
        return totalPrice;
    },

    checkSideValue : function(side){
        if (side === 'coconut rice') {
            return 0.50;
        } else if (side=== 'rice noodle' || side === 'egg noodle') {
            return 1;
        }
        return 0;
    },

    calculateCouponValue : function(){
        if(thaiFood.customerOrder.order.length>0){
            return thaiFood.cart.calculateTotalPrice()/100*thaiFood.customerOrder.coupon.redeemValue;
        }
        return 0;
    }
}
