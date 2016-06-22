/**
 * Created by Fidelity 2015 on 20/06/2016.
 */
var checkout = {
    coupon: {},
    restaurantId : 1,
    order :[
        {
            orderNum: '101',
            extras: {},
            quantity: 1
        },
        {
            orderNum: '102',
            extras: {
                
            },
            quantity: 1
        }
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
                        '<p class="menu_option_name" onclick="displayChooseItemMenu(' + counter  + ', ' + menu[i].Items[j]  + ')">'  +
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

    var populateCheckout = function(){
        //Showing all the orders
        for(var i = 0; i<checkout.order.length; i++){
            var orderList = document.getElementsByClassName('order_list');
            orderList[0].innerHTML += '<div class="order_list_item"></div>';
        }
        
        for(var i = 0; i<checkout.order.length; i++){
            var orderListItem = document.getElementsByClassName('order_list_item');
            orderListItem[i].innerHTML += '<div class="menu_option_text">' +
                '<p class="menu_option_name">' + 'Chicken & Cashew Nuts' + '</p>' +
                '<p class="menu_option_description">with ' + 'egg noodles (€1.00)' + '</p>' +
                '</div>' +
                '<div class="menu_option_nonText">' +
                '<p class="menu_option_price">€' + '11.50' + '</p>' +
                '</div>';

        }
    }
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
        $.get("../chooseOrderItem/addItem.html", function(data) {
            var menu_type = document.getElementsByClassName("menu_option_chooseItem");
            menu_type[itemId].innerHTML += data;
        });
    }
}

var removeChooseItemMenu = function(self){
    var itemId = $(self).parent().parent().parent().parent().attr('id');
    document.getElementById(itemId).innerHTML = '';
    console.log(itemId);
}