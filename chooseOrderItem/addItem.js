thaiFood.createNamespace("osl.addOrder");

thaiFood.addOrder = {
    minusNum : function(self){
        var outputField;

        for(var i = 0; i < self.parentNode.children.length; i++) {
            if(self.parentNode.children[i].className === 'qty') {
                outputField = self.parentNode.children[i];
                break;
            }
        }

        if(outputField) {
            var currentNum = parseInt(outputField.value);
            if((currentNum-1) >= 0){
                outputField.value = currentNum-1;
            }
        }
    },

    addNum : function (self){
        var outputField;

        for(var i = 0; i < self.parentNode.children.length; i++) {
            if(self.parentNode.children[i].className === 'qty') {
                outputField = self.parentNode.children[i];
                break;
            }
        }

        if(outputField) {
            var currentNum = parseInt(outputField.value);
            outputField.value = currentNum+1;
        }
    },

    removeChooseItemMenu : function (self){
        var itemId = $(self).parent().parent().parent().parent().attr('id');
        document.getElementById(itemId).innerHTML = '';
    },

    addToCart : function (foodItem, itemId){
        var quantity = document.getElementById('quantity'+itemId).value;
        if(quantity>0){
            var options = document.getElementsByName('name'+itemId);
            var checkedOption = { value : '' };

            if($('div#chooseItem' + itemId).find('.grid__item1')[1].style.display !== 'none') {
                for (var i = 0; i < options.length; i++) {
                    if (options[i].checked) {
                        checkedOption = options[i];
                        break;
                    }
                }
            }

            document.getElementById('chooseItem'+itemId).innerHTML = '';
            thaiFood.customerOrder.order.push({
                id: foodItem.Id,
                title: foodItem.Title,
                price: foodItem.Price,
                with: checkedOption.value,
                quantity: quantity
            });
            thaiFood.cart.populateCart();
            thaiFood.cart.checkOrderSize();
        }
        else{
            console.log("order must be at least one");
        }
    }
}