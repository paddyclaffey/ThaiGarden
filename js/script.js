$(document).ready(function() {
    // fetches and promises
    fetch('http://localhost:8081/restaurantMenu').then(function(result) {
        return result.json(); // a promise of JSON
    }).then(function(menu) { // the menu is now the JSON
        console.log(menu);
        var starterMenu = document.getElementByClass("menu_starters");

        for(var i=0;i<menu.length; i++) {
            if(menu[i].Title) {
                starterMenu.innerHTML = '<p class="menu_header">Starters</p>';
            }
            if(menu[i].Items.length>0){
                starterMenu.innerHTML += '<div class="menu_option">';
                for (var j = 0; j < menu[i].Items.length; j++) {
                    starterMenu.innerHTML += '<p class="menu_option_name">' + menu[i].Items[j].Title + '</p>';
                    starterMenu.innerHTML += '<p class="menu_option_description">' + menu[i].Items[j].Description + '</p>';
                    starterMenu.innerHTML += '<p class="menu_option_price">' + menu[i].Items[j].Price + '</p>';
                }
                starterMenu.innerHTML += '</div>';
            }

        }
    });
    //expand/collapse
});

var populateList = function(starterOptions){

}