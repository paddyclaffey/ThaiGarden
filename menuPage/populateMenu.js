/**
 * Created by Fidelity 2015 on 20/06/2016.
 */

thaiFood.createNamespace("osl.menu");


var checkout = {
    coupon: { id: 'first', redeemValue: 10},
    restaurantId : 1,
    order :[
    ]
};

var ready = function() {
    // fetches and promises
    fetch('http://localhost:8081/restaurantMenu').then(function(result) {
        return result.json(); // a promise of JSON
    }).then(function(menu) { // the menu is now the JSON
        var starterMenu = document.getElementsByClassName("menu_container");
        var counter = 0;

        for(var i=0;i<menu.length; i++){
            starterMenu[0].innerHTML += '<div class="menu_type"></div>';
        }

        for(var i=0;i<menu.length; i++) {
            var menu_type = document.getElementsByClassName("menu_type");

            if(menu[i].Title) {
                menu_type[i].innerHTML += '<div class="menu_header"' +
                    'onclick="expandCollapse(\'' + menu[i].Title + '\')"><span>' + menu[i].Title +
                    '</span><img name="' + menu[i].Title + 'expandIcon" src="../images/chevron.png"></div>' +
                    '<div class="bottom_border"></div>';
            }

            if(menu[i].Items.length>0){
                for (var j = 0; j < menu[i].Items.length; j++) {
                    menu_type[i].innerHTML += '<div name="' + menu[i].Title + '" class="menu_option"></div>';
                    menu_type[i].innerHTML += '<div id="chooseItem' + (j+counter) + '" class="menu_option_chooseItem"></div>';
                }

                for (var j = 0; j < menu[i].Items.length; j++) {
                    var menu_option = document.getElementsByClassName("menu_option");
                    menu_option[counter].innerHTML += '<div class="menu_option_text">' +
                        "<p class='menu_option_name' onclick='displayChooseItemMenu(" + counter  + ", " + JSON.stringify(menu[i].Items[j])  + ")'>"  +
                            menu[i].Items[j].Title + '</p>' +
                        '<p class="menu_option_description">' + menu[i].Items[j].Description + '</p><hr>' +
                        '</div>' +
                        '<div class="menu_option_nonText">' +
                        '<p class="menu_option_price">€' + menu[i].Items[j].Price + '</p>' +
                        '</div>';
                    counter ++;
                }
            }
        }
        populateCheckout();
    });
};

var expandCollapse = function (elementName){
    var image = document.getElementsByName( elementName +'expandIcon');
    if(!(image[0].style.transform === 'rotate(0deg)')){
        image[0].style.transform = 'rotate(0deg)';
    }
    else{
        image[0].style.transform = 'rotate(90deg)';
    }

    var elements = document.getElementsByName(elementName);
    for(var i=0; i<elements.length;i++){
        if(elements[i].style.display === "none"){
            elements[i].style.display = "flex";
        }
        else{
            elements[i].style.display = "none";
        }
    }
}

var displayCheckout = function(){
    document.getElementById("checkout").style.display = 'flex';
    document.getElementById("proceedToCheckoutButton").style.display = 'none';
}

var confirmOrder = function(){
    alert("confirmed");
}

var cancelOrder = function(){
    document.getElementById("checkout").style.display = 'none';
    document.getElementById("proceedToCheckoutButton").style.display = 'block';
}

var displayChooseItemMenu = function(itemId, foodItem){
    if(document.getElementById("chooseItem" + itemId).innerHTML === '') {
        this.itemId = itemId;
        $.get("../chooseOrderItem/addItem.html", function(data) {
            var menu_type = document.getElementsByClassName("menu_option_chooseItem");
            var list;

            menu_type[itemId].innerHTML += data;

            //giving each radio button a unique group name based on itemId
            list = $('div#chooseItem' + itemId).find('div > label > input');
            for(var i=0; i<list.length;i++){
                list[i].name = 'name'+itemId;
            }

            //giving output of quantity a unique id
            $('div#chooseItem' + itemId).find('input.qty')[0].id = 'quantity'+itemId;


            //adding function to onclick event
            $('div#chooseItem' + itemId).find('button')[0].onclick = function() { addToCart(foodItem, itemId); }
        });
    }
}

var removeChooseItemMenu = function(self){
    var itemId = $(self).parent().parent().parent().parent().attr('id');
    document.getElementById(itemId).innerHTML = '';
}

function addToCart(foodItem, itemId){
    var quantity = document.getElementById('quantity'+itemId).value;
    if(quantity>0){
        var options = document.getElementsByName('name'+itemId);
        var checkedOption;

        for(var i=0; i <options.length; i++){
            if(options[i].checked){
                checkedOption = options[i];
                break;
            }
        }

        if(checkedOption){
            console.log("you have selected: " + checkedOption.value + " and you want order(s): " + quantity );
            document.getElementById('chooseItem'+itemId).innerHTML = '';
            checkout.order.push({
                id: foodItem.Id,
                title: foodItem.Title,
                price: foodItem.Price,
                with: checkedOption.value,
                quantity: quantity
            });
            populateCheckout();
            checkOrderSize();
        }
        else {
            console.log("error nothing checked");
        }
    }
    else{
        console.log("order must be at least one");
    }
}

var populateCheckout = function(){
    document.getElementsByClassName('order_list')[0].innerHTML = '';
    document.getElementsByClassName('order_coupon')[0].innerHTML = '';

    if(checkout.order.length>0) {
        //Showing all the orders
        for (var i = 0; i < checkout.order.length; i++) {
            var orderList = document.getElementsByClassName('order_list');
            orderList[0].innerHTML += '<div class="order_list_item"></div>';
        }

        for (var i = 0; i < checkout.order.length; i++) {
            var orderListItem = document.getElementsByClassName('order_list_item');
            var sidePrice = checkSideValue(checkout.order[i].with);

            orderListItem[i].innerHTML += '<div class="menu_option_text">' +
                '<p class="menu_option_name">'  + checkout.order[i].quantity + ' x ' + checkout.order[i].title + '</p>' +
                '<p class="menu_option_description">with ' + checkout.order[i].with + ' (€' + sidePrice.toFixed(2) + ')</p>' +
                '</div>' +
                '<div class="menu_option_nonText">' +
                '<p class="menu_option_price">€' + calculateItemPrice(checkout.order[i].price,checkout.order[i].quantity, sidePrice).toFixed(2) + '</p>' +
                '<p class="menu_option_cancel" onclick="removeItemFromCart(' + i + ')">Cancel</p>' +
                '</div>';
        }

        populateCoupon();
        populateTotal()
    }
    else{
        var orderList = document.getElementsByClassName('order_list');
        orderList[0].innerHTML += '<div class="order_list_empty">' +
            '<p>You have nothing in your Cart</p></div>';
    }
}

var calculateItemPrice = function(price, quantity, side){
    return (price + side ) * quantity;
}

var calculateTotalPrice = function(){
    var totalPrice = 0;
    for(var i = 0; checkout.order.length>i; i++){
        totalPrice += (checkout.order[i].price + checkSideValue(checkout.order[i].with )) * checkout.order[i].quantity;
    }
    return totalPrice;
}

var checkOrderSize = function (){
    if(checkout.order.length>0){
        document.getElementById('proceedToCheckoutButton').style.display = 'block';
    }
    else{
        document.getElementById('proceedToCheckoutButton').style.display = 'none';
    }
}

var removeItemFromCart = function(itemPosition){
    checkout.order.splice(itemPosition, 1);
    populateCheckout();
    checkOrderSize();
}

var redeemValuePrice = function(){
    return 2;
}

var populateCoupon = function(){
    if(checkout.coupon.id){
        //ready for multiple coupons
        //for(var i=0; i<checkout.coupon.length; i++){
        var couponList = document.getElementsByClassName('order_coupon');
        couponList[0].innerHTML += '<div class="order_coupon_item"></div>';
        //}

        //ready for multiple coupons
        //for(var i=0; i<checkout.coupon.length; i++){
        var couponListItem = document.getElementsByClassName('order_coupon_item');
        couponListItem[0].innerHTML += '<div class="order_coupon_item_name">' +
            '<p>Coupon (' + checkout.coupon.redeemValue + '% Off)</p></div>' +
            '<div class="order_coupon_item_value"><p>€' + redeemValuePrice().toFixed(2) + '</p></div>';
        //}
        document.getElementById('addCoupon').style.display = 'none';
        document.getElementById('displayCoupon').style.display = 'block';
    }
    else{
        document.getElementById('addCoupon').style.display = 'block';
        document.getElementById('displayCoupon').style.display = 'none';
    }
}

var populateTotal = function(){
    if(checkout.order.length>0){
        document.getElementsByClassName('order_total')[0].innerHTML =
            '<div class="order_total_title">' +
                '<p>Total</p>' +
            '</div>' +
            '<div class="order_total_amount">' +
                '<p>' + calculateTotalPrice().toFixed(2) + '</p>' +
            '</div>';
    }
    else{
        document.getElementsByClassName('order_total')[0].innerHTML = '';
    }
}

var checkSideValue = function(side){
    if (side === 'coconut rice') {
        return 0.50;
    } else if (side=== 'rice noodle' || side === 'egg noodle') {
        return 1;
    }
    return 0;
}