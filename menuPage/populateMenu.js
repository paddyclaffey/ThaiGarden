/**
 * Created by Fidelity 2015 on 20/06/2016.
 */

thaiFood.createNamespace("osl.menu");

thaiFood.customerOrder = {
    coupon: { id: 'first', redeemValue: 10},
    restaurantId : 1,
    order :[]
};

thaiFood.menu = {
    ready: function () {
        // fetches and promises
        fetch('http://localhost:8081/restaurantMenu').then(function (result) {
            return result.json(); // a promise of JSON
        }).then(function (menu) { // the menu is now the JSON
            var starterMenu = document.getElementsByClassName("menu_container");
            var counter = 0;

            for (var i = 0; i < menu.length; i++) {
                starterMenu[0].innerHTML += '<div class="menu_type"></div>';
            }

            for (var i = 0; i < menu.length; i++) {
                var menu_type = document.getElementsByClassName("menu_type");

                if (menu[i].Title) {
                    menu_type[i].innerHTML += '<div class="menu_header"' +
                        'onclick="thaiFood.menu.expandCollapse(\'' + menu[i].Title + '\')"><span>' + menu[i].Title +
                        '</span><img name="' + menu[i].Title + 'expandIcon" src="../images/chevron.png"></div>' +
                        '<div class="bottom_border"></div>';
                }

                if (menu[i].Items.length > 0) {
                    for (var j = 0; j < menu[i].Items.length; j++) {
                        menu_type[i].innerHTML += '<div name="' + menu[i].Title + '" class="menu_option"></div>';
                        menu_type[i].innerHTML += '<div id="chooseItem' + (j + counter) + '" class="menu_option_chooseItem"></div>';
                    }

                    for (var j = 0; j < menu[i].Items.length; j++) {
                        var menu_option = document.getElementsByClassName("menu_option");
                        menu_option[counter].innerHTML += '<div class="menu_option_text">' +
                            "<p class='menu_option_name' onclick='thaiFood.menu.loadOrderItem(" + counter  + ", " + JSON.stringify(menu[i].Items[j])  + ")'>"  +
                            menu[i].Items[j].Title + '</p>' +
                            '<p class="menu_option_description">' + menu[i].Items[j].Description + '</p><hr>' +
                            '</div>' +
                            '<div class="menu_option_nonText">' +
                            '<p class="menu_option_price">€' + menu[i].Items[j].Price + '</p>' +
                            '</div>';
                        counter++;
                    }
                }

                if(menu[i].Title !== 'Thai Curry Dishes'){
                    thaiFood.menu.expandCollapse(menu[i].Title);
                }
            }
            thaiFood.cart.populateCart();
        });
    },

    expandCollapse : function (elementName) {
        var image = document.getElementsByName(elementName + 'expandIcon');
        if (!(image[0].style.transform === 'rotate(0deg)')) {
            image[0].style.transform = 'rotate(0deg)';
        }
        else {
            image[0].style.transform = 'rotate(90deg)';
        }

        var elements = document.getElementsByName(elementName);
        elements = $(elements[0]).parent().children();
        for (var i = 2; i < elements.length; i++) {
            if (elements[i].style.display === "none") {
                elements[i].style.display = "flex";
            }
            else {
                elements[i].style.display = "none";
            }
        }
    },

    loadCart : function(){
        //$.get("../chooseOrderItem/addItem.html", function(data) {        });
    },
    
    //should be used to pull in the html to display this to reduce the code directly on menu.html
    loadCheckout : function(){
        //$.get("../chooseOrderItem/addItem.html", function(data) {        });
    },

    loadOrderItem : function(itemId, foodItem){
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
                $('div#chooseItem' + itemId).find('button')[0].onclick = function() { thaiFood.addOrder.addToCart(foodItem, itemId); }

                if(!foodItem.HasVariation){
                    var gridItems = $('div#chooseItem' + itemId).find('.grid__item1');
                    gridItems[1].style.display = 'none';
                    gridItems[2].style.display = 'none';
                }
            });
        }
    }

};




